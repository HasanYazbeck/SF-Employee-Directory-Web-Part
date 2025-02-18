import * as React from 'react';
import {useState} from 'react';

// Interfaces
import {INodeProps, OrganizationlChartState, IOrganizationalChartProps} from './IOrganizationlChart';
import { Employee  } from './IOrganizationlChart';
import { IUser } from '../IEmployeeDirectoryProps';

// Icons
import { Search } from 'lucide-react';

// Sample Data
import { initialOrgData } from './data';

// Styles
import styles from './OrganizationalCard.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import {  useTheme, ITheme } from "@fluentui/react";

import { PersonaSize } from '@fluentui/react/lib/Persona';
import { Persona } from "@fluentui/react";
import { mergeStyles } from "@fluentui/react/lib/Styling";

// Helpers
import {SPHelpers} from './../../../Classess/SPHelpers';

export default class OrganizationalChart extends React.Component<IOrganizationalChartProps, OrganizationlChartState> {
  private spHelpers: SPHelpers = new SPHelpers();

    constructor(props: IOrganizationalChartProps) {
        super(props);
        this.state = {
            orgData: undefined
        };
    }

    private Node: React.FC<INodeProps & { expandedNodes: Set<string>; toggleNode: (id: string) => void }> = ({
        employee,
        isExpanded,
        onToggle,
        isDragging,
        onDragStart,
        onDragOver,
        onDrop,
        level = 0,
        expandedNodes,
        toggleNode
      }) => {
        const [isOver, setIsOver] = useState(false);
        const theme: ITheme = useTheme();
        const personaStyles = React.useMemo(
          () => ({
            root: {
              backgroundColor: theme.palette.themePrimary,
              color: theme.palette.white,
              borderRadius: "50%",
              cursor: "pointer",
              width: "80px !important",
              height: "80px !important",
              display: "flex !important",
              justifyContent: "center !important",
              alignItems: "center !important",
              margin: "auto !important"
            },
            primaryText: {
              color: theme.palette.white,
            },
            imageArea: {
              borderRadius: "50%",
              width: "80px !important",
              height: "80px !important",
            },
            image: {
              borderRadius: "50%",
              width: "80px !important",
              height: "80px !important",
            },
            initials: {
              backgroundColor: "inherit",
              color: theme.palette.white,
              lineHeight: "40px !important",
              height: "40px !important",
            },
          }),
          [theme]
        );
        const handleDragOver = (e: React.DragEvent): void => {
          e.preventDefault();
          setIsOver(true);
          onDragOver(e);
        };
      
        const handleDragLeave = (): void => {
          setIsOver(false);
        };
      
        const handleDrop = (e: React.DragEvent): void => {
          e.preventDefault();
          setIsOver(false);
          onDrop(e, employee);
        };
    
        return (
          <div className={`${styles.orgNode}`}>
            <div draggable="false" onDragStart={(e) => onDragStart(e, employee)}
              onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
              className={`${isOver ? 'is-over' : ''} ${isDragging ? 'opacity-50' : ''} ${styles.nodeWrapper}`}>
              <div className={`${styles.orgCardHeader}`}>
              <div className={`${styles.orgCardContent}`}>
                <div className={`${styles.cardContainer}`}>
                  <div className={styles.imageSection}>
                    <div className={styles.imageWrapper}>
                      {employee.profileImageUrl ? (<img src={employee.profileImageUrl} alt={`${employee.name}'s profile`}/>) : (
                      <Persona imageInitials={ employee.profileImageUrl? undefined: this.spHelpers.getInitials(employee.displayName)}
                      imageAlt={`${employee.displayName}'s profile picture`}
                      hidePersonaDetails={true} styles={personaStyles}
                      size={PersonaSize.size48}
                      initialsColor={mergeStyles({backgroundColor: theme.palette.themePrimary,
                      })}/>
                      )}
                      {/* <div className={styles.statusIndicator}/> */}
                    </div>
                    <div className={styles.toggleWrapper}>
                      {employee.children && employee.children.length > 0 && (
                        <button className={styles.toggleButton} onClick={() => onToggle()}>
                          <span className={`${styles.toggleIcon} ${isExpanded ? styles.expanded : ''}`}>
                            {isExpanded ? '−' : `+${employee.children.length}`}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className={styles.infoSection}>
                    <h3 className={`text-capitalize ${styles.orgCardTitle}`}>{employee.displayName}</h3>
                    <p className={`text-capitalize ${styles.orgCardSubtitle}`}>{employee.jobTitle}</p>
                    <div className={styles.cardFooter}>
                    {employee.department && <span className={`text-capitalize ${styles.department}`}>{employee.department}</span>} 
                    {employee.isSelected && employee.manager && (
                        <span className={`text-capitalize ${styles.managerInfo}`}>
                          <span className={styles.managerLabel}>Manager</span>
                          <span className={styles.managerName}>{employee.manager.displayName}</span>
                        </span>
                      )}
                      {/* <div className={styles.actionButtons}>
                        <button className={styles.iconButton} title="Send email" id= {employee.mail}>
                          ✉️
                        </button>
                        <button className={styles.iconButton} title="Call" id= {employee.mobilePhone}>
                          📞
                        </button>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
              </div>
          
            </div>
            {isExpanded && employee.children && employee.children.length > 0 && (
              <div className={`${styles.orgChildren}`}>
                <div className={`${styles.orgChildrenWrapper} ${employee.children.length > 1 ? styles.multipleChildren : ''}`}>
                  {employee.children.map((child) => (
                    <this.Node
                      key={child.id}
                      employee={child}
                      isExpanded={expandedNodes.has(child.id)}
                      onToggle={() => toggleNode(child.id)}
                      isDragging={isDragging}
                      onDragStart={onDragStart}
                      onDragOver={onDragOver}
                      onDrop={onDrop}
                      level={level + 1}
                      expandedNodes={expandedNodes}
                      toggleNode={toggleNode}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
    };
    
    public OrgChart: React.FC = () => {
        const [orgData, setOrgData] = useState<Employee>(initialOrgData);
        const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([orgData.id]));
        const [searchTerm, setSearchTerm] = useState('');
        const [draggedEmployee, setDraggedEmployee] = useState<Employee | null>(null);
        
        // Declare the ref here
        const matchingNodeRef = React.useRef<HTMLDivElement>(null);

        React.useEffect(() => {
        const userMap = this.buildOrgTree(this.props.users);
        if(userMap) {
          const rootEmployee = userMap?.get(this.props.employee?.id || '');
          setOrgData(rootEmployee || initialOrgData);
          }
        },[]);

        const toggleNode = (employeeId: string): void => {
          setExpandedNodes((prev) => {
            const next = new Set([...prev]);
            if (next.has(employeeId)) {
              // When collapsing, only remove the current node
              next.delete(employeeId);
            } else {
              // When expanding, only add the current node
              next.add(employeeId);
            }
            return next;
          });
        };
      
        const handleDragStart = (e: React.DragEvent, employee: Employee): void => {
          setDraggedEmployee(employee);
          e.dataTransfer.setData('text/plain', employee.id);
          e.dataTransfer.effectAllowed = 'move';
        };
      
        const handleDragOver = (e: React.DragEvent): void => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
        };
      
        const removeEmployeeFromTree = (data: Employee, employeeId: string): Employee => {
          if (!data.children) return data;
      
          return {
            ...data,
            children: data.children
              .filter(child => child.id !== employeeId)
              .map(child => removeEmployeeFromTree(child, employeeId))
          };
        };
      
        const findAndUpdateEmployee = (
          data: Employee,
          sourceId: string,
          targetId: string
        ): Employee => {
          if (!draggedEmployee) return data;
      
          if (data.id === targetId) {
            if (sourceId === targetId) return data;
            
            const isDescendant = (emp: Employee, targetId: string): boolean => {
              if (emp.id === targetId) return true;
              return emp.children?.some(child => isDescendant(child, targetId)) || false;
            };
            
            if (draggedEmployee.children?.some(child => isDescendant(child, targetId))) {
              return data;
            }
            return { ...data,
              children: [...(data.children || []), draggedEmployee],
            };
          }
      
          if (data.children) {
            return { ...data,
              children: data.children.map((child) => findAndUpdateEmployee(child, sourceId, targetId)),
            };
          }
          return data;
        };
      
        const handleDrop = (e: React.DragEvent, target: Employee): void => {
          e.preventDefault();
          if (!draggedEmployee || draggedEmployee.id === target.id) return;
      
          setOrgData((prev) => {
            const treeWithoutDragged = removeEmployeeFromTree(prev, draggedEmployee.id);
            return findAndUpdateEmployee(treeWithoutDragged, draggedEmployee.id, target.id);
          });
          setDraggedEmployee(null);
        };
      
        const filterOrgData = (data: Employee, term: string): Employee | null => {
          const employeeCopy = { ...data };

           // Check if the current node matches the search term
        const matches = [
            employeeCopy.displayName,
            employeeCopy.jobTitle,
            employeeCopy.department,
            employeeCopy.mail,
            employeeCopy.location
        ].some(field => field?.toLowerCase().includes(term.toLowerCase()));

        // If this node matches, mark it and return it with all its children
        if (matches) {
            employeeCopy.isSelected = true;
            if (employeeCopy.children) {
              employeeCopy.children = employeeCopy.children.map(child => ({
                  ...child,
                  isSelected: false
              }));
          }
            return employeeCopy;
        }

        // If this node has children, recursively search them
        if (employeeCopy.children && employeeCopy.children.length > 0) {
            const matchingChildren = employeeCopy.children
                .map(child => filterOrgData(child, term))
                .filter((child): child is Employee => child !== null);

            // If any children match, return this node with only the matching children
            if (matchingChildren.length > 0) {
                employeeCopy.children = matchingChildren;
                employeeCopy.isSelected = false;
                return employeeCopy;
            }
        }
        return null;
        };

        // Add useEffect to handle search term changes
        React.useEffect(() => {
            if (searchTerm) {
                const filtered = filterOrgData(orgData, searchTerm);
                if (filtered) {
                    // Automatically expand all nodes when searching
                    const nodesToExpand = new Set<string>();
                    const collectNodeIds = (node: Employee, isParentPath: boolean): void => {
                      if (isParentPath|| node.isSelected) {
                        nodesToExpand.add(node.id);
                    } 
                      node.children?.forEach(child => {
                        collectNodeIds(child, (isParentPath && !node.isSelected) || node.isSelected);
                      });
                    };
                    collectNodeIds(filtered, true);
                    setExpandedNodes(nodesToExpand);

                    // Add small delay to ensure DOM is updated
                    setTimeout(() => {
                      if (matchingNodeRef.current) {
                          matchingNodeRef.current.scrollIntoView({
                              behavior: 'smooth',
                              block: 'center'
                          });
                      }
                  }, 100);
                }
            } else {
                // Reset expanded nodes when search is cleared
                setExpandedNodes(new Set([orgData.id]));
            }
        }, [searchTerm, orgData]);
      
        const filteredData = searchTerm ? filterOrgData(orgData, searchTerm) || orgData : orgData;
      
        return (
          <div className={`min-vh-80 bg-light`}>
            <div className="container-fluid">
            { this.props.withSearch && (
              <div className={`${styles.searchWrapper} ${styles.stickySearch}`}>
              <div className={`${styles.searchContainer}`}>
                <Search className={`${styles.searchIcon}`} size={20} />
                <input type="text" placeholder="Search by name, title, or department..."
                  className={`${styles.searchInput}`}
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>)}
            
              <div className={`${styles.orgChart} ${styles.scrollable}`}>
               { <this.Node
                  employee={filteredData}
                  isExpanded={expandedNodes.has(filteredData.id)}
                  onToggle={() => toggleNode(filteredData.id)}
                  isDragging={draggedEmployee !== null}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  expandedNodes={expandedNodes}
                  toggleNode={toggleNode}
                />}
              </div>
            </div>
          </div>
        );
    };

    private buildOrgTree(users: IUser[]):  Map<string, Employee> | undefined {
    const userMap = new Map<string, Employee>();

    // First, create Employee objects for all users
    users.forEach((user) => {
        userMap.set(user.id, {
            id: user.id,
            displayName: user.displayName,
            jobTitle: user.jobTitle || '',
            department: user.department || '',
            mail: user.mail || '',
            mobilePhone: user.mobilePhone || '',
            location: user.location || '',
            profileImageUrl: user.profileImageUrl || '',
            manager: user.manager || undefined,
            children: [],
            isSelected: user.isSelected
        });
    });

    // Find the root (user without manager) and build hierarchy
    const root = users.find(user => !user.manager)?.id;
    if (!root) return undefined;

    // Build parent-child relationships
    users.forEach((user) => {
        if (user.manager && user.manager.id) {
            const parentEmployee = userMap.get(user.manager.id);
            const childEmployee = userMap.get(user.id);
            if (parentEmployee && childEmployee) {
                parentEmployee.children = parentEmployee.children || [];
                parentEmployee.children.push(childEmployee);
            }
        }
    });  
    return userMap;
    }

    public render(): React.ReactElement<{}> {
      return <this.OrgChart />
    }
}
