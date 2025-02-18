import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IUser } from "../IEmployeeDirectoryProps";

export interface OrganizationlChartState {
  orgData: Employee | undefined;
  expandedNodes?: Set<string>;
  searchTerm?: string;
  draggedEmployee?: Employee | undefined;
}

export interface IOrganizationalChartProps {
  context: WebPartContext;
  employee: IUser | undefined;
  users: IUser[];
  withSearch?: boolean;
}

export interface IOrgChartNode {
  id: string;
  name: string;
  title: string;
  role: string;
  email?: string;
  phone?: string;
  department?: string;
  imageUrl: string;
  children?: IOrgChartNode[];
}

export interface INodeProps {
  employee: Employee;
  isExpanded: boolean;
  onToggle: () => void;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent, employee: Employee) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, target: Employee) => void;
  level?: number;
}

export interface Employee {
  department: string;
  displayName: string;
  name?: string;
  id: string;
  jobTitle?: string;
  location?: string;
  mail?: string;
  mobilePhone?: string | undefined;
  officeLocation?: string | undefined;
  phoneNumber?: string | undefined;
  profileImageUrl?: string | undefined;
  children?: Employee[];
  manager?: {id: string | undefined , displayName: string | undefined} | undefined;
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