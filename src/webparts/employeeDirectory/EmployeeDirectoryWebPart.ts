import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { ThemeProvider, ThemeChangedEventArgs } from '@microsoft/sp-component-base';

import * as strings from 'EmployeeDirectoryWebPartStrings';
import { MSGraphClientV3 } from '@microsoft/sp-http';
import { IEmployeeDirectoryComponentsProps, 
         IEmployeeDirectoryWebPartProps, 
         IGraphResponse, 
         IGraphUserResponse, 
         IUser } from './components/IEmployeeDirectoryProps';
import EmployeeDirectory from './components/EmployeeDirectory';  // Add this import

export default class EmployeeDirectoryWebPart extends BaseClientSideWebPart<IEmployeeDirectoryWebPartProps> {
  private _users: IUser[] = [];
  private _themeVariant: IReadonlyTheme | undefined;
  private _themeProvider: ThemeProvider;

  protected async onInit(): Promise<void> {
    await super.onInit();

    if (this.properties.usersPerPage === undefined) {
      this.properties.usersPerPage = 10;
    }

    this._themeProvider = this.context.serviceScope.consume(ThemeProvider.serviceKey);
    this._themeVariant = this._themeProvider.tryGetTheme();
    this._themeProvider.themeChangedEvent.add(this, this._handleThemeChangedEvent);

    return this._getUsers();
  }

  private _handleThemeChangedEvent(args: ThemeChangedEventArgs): void {
    this._themeVariant = args.theme;
    this.render();
  }

  public render(): void {
    
    const element: React.ReactElement<IEmployeeDirectoryComponentsProps> = React.createElement(
      EmployeeDirectory,
      {
        users: this._users,
        usersPerPage: this.properties.usersPerPage,
        siteUrl: this.context.pageContext.web.absoluteUrl,
        themeVariant: this._themeVariant,
        context: this.context
      }
    );
    ReactDom.render(element, this.domElement);
   
  }


  private async _getUsers(): Promise<void> {
    let users: IUser[] = [];
    let nextLink: string | null = '/users?$select=id,displayName,mail,department,jobTitle,mobilePhone,officeLocation&$expand=manager($select=id,displayName)';
  
    try {
      const client: MSGraphClientV3 = await this.context.msGraphClientFactory.getClient("3");
  
      while (nextLink) {
        const response: IGraphResponse = await client.api(nextLink).get();
  
        if (response && Array.isArray(response.value)) {
          const mappedUsersPromises: Promise<IUser | null>[] = response.value.map(async (user: IGraphUserResponse) => {
            if (!user.mail) {
              return null;
            }

            let profileImageUrl: string | undefined;
  
            try {
              const photoResponse: ArrayBuffer = await client.api(`/users/${user.id}/photo/$value`).get();
              if (photoResponse) {
                const blob = new Blob([photoResponse], { type: 'image/jpeg' });
                profileImageUrl = URL.createObjectURL(blob);
              }
            } catch (error) {
              console.log('Error fetching user photo:', error);
            }
            const mappedUser: IUser = {
              id: user.id,
              displayName: user.displayName,
              mail: user.mail,
              department: user.department,
              jobTitle: user.jobTitle,
              phoneNumber: user.mobilePhone,
              location: user.officeLocation,
              profileImageUrl,
              mobilePhone: user.mobilePhone,
              officeLocation: user.officeLocation,
              manager: user.manager && user.manager.id !== user.id ? {
                displayName: user.manager.displayName,
                id: user.manager.id
               } : undefined ,
               isSelected: false
          };
          
          return mappedUser;
          });
  
          const mappedUsers = await Promise.all(mappedUsersPromises);
          users = users.concat(mappedUsers.filter((user): user is IUser => user !== null));
  
          nextLink = response["@odata.nextLink"] || null;
        } else {
          console.error('Data fetched is not in expected format:', response);
          nextLink = null;
        }
      }
      this._users = users.filter(user => user.mail && !user.mail?.toLowerCase().includes("healthmailbox") 
                                                   && !user.mail?.toLowerCase().includes("softflow-intl.com") 
                                                   && !user.mail?.toLowerCase().includes("sync"));
    } catch (error) {
      console.error('Error fetching users:', error);
      this._users = [];
    }
    // console.log("Users list:", this._users)
    this.render();
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
    if (this._themeProvider) {
      this._themeProvider.themeChangedEvent.remove(this, this._handleThemeChangedEvent);
    }
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneSlider('usersPerPage', {
                  label: 'Users per page',
                  min: 1,
                  max: 50,
                  step: 1,
                  showValue: true
                })
              ]
            }
          ]
        }
      ]
    };
  }
}