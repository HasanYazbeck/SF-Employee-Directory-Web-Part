import IUser from "../EmployeeDirectoryWebPart";
import { IReadonlyTheme } from '@microsoft/sp-component-base';

export interface IEmployeeDirectoryProps {
  users: IUser[];
  usersPerPage: number;
  siteUrl: string;
  themeVariant?: IReadonlyTheme|undefined;

}
