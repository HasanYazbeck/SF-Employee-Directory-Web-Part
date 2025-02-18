import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IEmployeeDirectoryProps {
  users: IUser[];
  usersPerPage: number;
  siteUrl: string;
  themeVariant?: IReadonlyTheme|undefined;
}

export interface IUser {
  department?: string;
  displayName: string;
  name?: string;
  id: string;
  jobTitle?: string;
  location?: string;
  mail?: string;
  phoneNumber?: string;
  manager?: {
    displayName: string;
    id: string;
  };
  mobilePhone?: string | undefined;
  profileImageUrl?: string;
  [key: string]: string | boolean | undefined | { displayName: string; id: string };
  isSelected: boolean;
}

export interface IEmployeeDirectoryComponentsProps {
  users: IUser[];
  usersPerPage: number;
  siteUrl: string;
  themeVariant?: IReadonlyTheme | undefined;
  context: WebPartContext;
}

export interface IEmployeeDirectoryWebPartProps {
  description: string;
  usersPerPage: number;
  context: WebPartContext;
}

export interface IOrgTreeNode {
  id: string;
  displayName: string;
  jobTitle?: string;
  children: IOrgTreeNode[];
  isSelected: boolean;
}

export interface IGraphUserResponse {
  id: string;
  displayName: string;
  mail: string;
  department?: string;
  jobTitle?: string;
  mobilePhone?: string;
  officeLocation?: string;
  manager?: {
    displayName: string;
    id: string;
  };
}

export interface IGraphResponse {
  value: IGraphUserResponse[];
  '@odata.nextLink'?: string;
}