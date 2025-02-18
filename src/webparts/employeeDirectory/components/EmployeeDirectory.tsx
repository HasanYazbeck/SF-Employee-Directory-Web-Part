/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from "react";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { loadStyles } from "@microsoft/load-themed-styles";
import QRCode from "qrcode.react";
import profilestyle from "./EmployeeDirectory.module.scss";
import liststyle from "./ListStyle.module.scss";
import { styled } from "@mui/material/styles";
import { Pagination } from "@material-ui/lab";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { CSVLink } from "react-csv";
import { ThemeProvider, useTheme, ITheme } from "@fluentui/react";
import {
  IconButton,
  PersonaSize,
  Persona,
  IButtonStyles,
  TooltipHost,
  DirectionalHint,
  IIconProps
} from "@fluentui/react";
import { mergeStyles } from "@fluentui/react/lib/Styling";
import { MenuProps } from "@mui/material/Menu";
import { IUser , IEmployeeDirectoryComponentsProps, IOrgTreeNode } from "./IEmployeeDirectoryProps";
import  OrganizationalChart  from "./OrganizationalChart/OrganizationalChart";
import { Modal } from "./Common/Modal/Modal";

type StyleType = typeof profilestyle | typeof liststyle;

function useDebounce(value: string, delay: number): string {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function generateVCardData(user: IUser): string {
  const escapeVCardValue = (value: string): string =>
    value.replace(/[,;\\]/g, "\\$&").replace(/\n/g, "\\n");

  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVCardValue(user.displayName)}`,
    `N:${escapeVCardValue(user.displayName.split(" ").reverse().join(";"))}`,
    `ORG:${escapeVCardValue(user.department || "")}`,
    `TITLE:${escapeVCardValue(user.jobTitle || "")}`,
    `EMAIL:${escapeVCardValue(user.mail || "")}`,
    `TEL:${escapeVCardValue(user.phoneNumber || "")}`,
    "END:VCARD",
  ].join("\r\n");
}

const EmployeeDirectory: React.FC<IEmployeeDirectoryComponentsProps> = ({
  users,
  usersPerPage,
  siteUrl,
  context
}) => {
  const iconsSize = 10;
  const topRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const theme: ITheme = useTheme();
  const NavButton: React.FC<{
    iconName: string;
    onClick: () => void;
    isActive: boolean;
  }> = ({ iconName, onClick, isActive }) => (
    <IconButton
      iconProps={{ iconName }}
      onClick={onClick}
      styles={{
        root: {
          color: theme.palette.neutralPrimary,
          selectors: {
            "&:hover": { color: theme.palette.themePrimary },
          },
        },
        icon: {
          fontSize: `${iconsSize}px`,
        },
      }}
    />
  );

  const navBarStyle = React.useMemo(
    () => ({
      backgroundColor: theme.palette.themePrimary,
      color: theme.palette.white,
    }),
    [theme]
  );

  const headerRowStyle = React.useMemo(
    () => ({
      backgroundColor: theme.palette.themePrimary,
      color: theme.palette.white,
    }),
    [theme]
  );

  const personaStyles = React.useMemo(
    () => ({
      root: {
        backgroundColor: theme.palette.themePrimary,
        color: theme.palette.white,
        borderRadius: "50%",
        cursor: "pointer",
      },
      primaryText: {
        color: theme.palette.white,
      },
      imageArea: {
        borderRadius: "50%",
      },
      image: {
        borderRadius: "50%",
      },
      initials: {
        backgroundColor: "inherit",
        color: theme.palette.white,
      },
    }),
    [theme]
  );

  const CustomPagination = styled(Pagination)({
    "& .MuiPaginationItem-root": {
      color: theme.palette.themePrimary,
      "&:hover": {
        backgroundColor: theme.palette.themeLighter,
      },
      "&.Mui-selected": {
        backgroundColor: theme.palette.themePrimary,
        color: theme.palette.white,
        "&:hover": {
          backgroundColor: theme.palette.themeDark,
        },
      },
    },
  });

  const StyledTextField = styled(TextField)({
    margin: "8px",
    minWidth: "200px",
    backgroundColor: "white",
    "& .MuiInputBase-root": {
      color: "#333",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ccc",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#4C1C24",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#4C1C24",
    },
    "& .Mui-focused label": {
      color: "#4C1C24",
    },
    "& .MuiSelect-select": {
      maxHeight: "200px",
      overflow: "auto",
    },
  });

  const menuProps: Partial<MenuProps> = {
    PaperProps: {
      style: {
        maxHeight: "200px",
        overflow: "auto",
        border: "1px solid #ccc",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
        borderRadius: "4px",
      },
    },
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "left",
    },
  };

  const menuItemStyle = {
    display: "block",
    width: "100%",
    padding: "8px 16px",
  };

  const filterContainerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    marginTop: "20px",
  };

  const filterFieldStyle = {
    flex: 1,
    margin: "0 8px",
    minWidth: 0,
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [currentStyle, setCurrentStyle] = useState(profilestyle);
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [titleFilter, setTitleFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [nameFilterInput, setNameFilterInput] = useState("");
  const [searchFilterInput, setSearchFilterInput] = useState("");
  const [showQR, setShowQR] = useState<{ [key: string]: boolean }>({});
  const [filteredUserCount, setFilteredUserCount] = useState(users.length);
  const debouncedNameFilter = useDebounce(nameFilterInput, 300);
  const debouncedSearchFilter = useDebounce(searchFilterInput, 300);
  const [activeStyle, setActiveStyle] = useState("profile");
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const resetPage = (): void => {setCurrentPage(1);};

  const handleStyleChange = (style: StyleType, styleName: string): void => {
    setCurrentStyle(style);
    setActiveStyle(styleName);
  };

  const scrollToTop = (): void => {
    if (topRef.current) {
      const webPartElement = topRef.current.closest(".ControlZone");
      if (webPartElement) {
        webPartElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ): void => {
    setCurrentPage(value);
    setTimeout(scrollToTop, 100);
  };

  const handleSearchFilterChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSearchFilterInput(e.target.value);
  };

  const handleNameFilterChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setNameFilterInput(e.target.value);
  };

  const handleDepartmentFilterChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setDepartmentFilter(e.target.value);
    resetPage();
  };

  const handleTitleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setTitleFilter(e.target.value);
    resetPage();
  };

  const clearFilters = (): void => {
    setDepartmentFilter("");
    setTitleFilter("");
    setSearchFilterInput("");
    setNameFilterInput("");
    setSearchFilter("");
    setNameFilter("");
    resetPage();
  };

  const filterUsers = (user: IUser): boolean => {
    const matchesPrefix = (
      value: string | undefined,
      prefix: string
    ): boolean => {
      return value
        ? value.toLowerCase().startsWith(prefix.toLowerCase())
        : false;
    };

    const includesSubstring = (value: string | undefined,substring: string): boolean => {
      return value? value.toLowerCase().includes(substring.toLowerCase()): false;
    };

    const departmentMatch = !departmentFilter || matchesPrefix(user.department, departmentFilter);
    const titleMatch = !titleFilter || matchesPrefix(user.jobTitle, titleFilter);

    const nameMatch = !nameFilter ||matchesPrefix(user.displayName, nameFilter) ||
      user.displayName.toLowerCase().split(" ").some((namePart) => matchesPrefix(namePart, nameFilter));

    const searchMatch = !searchFilter ||
      Object.entries(user).some(([key, value]) => {
        if (typeof value === "string") {
          return includesSubstring(value, searchFilter);
        } else if (key === "manager" && typeof value === "object" && value !== null) 
          {
          return includesSubstring(value.displayName, searchFilter);
          }
        return false;
      });

    return departmentMatch && titleMatch && nameMatch && searchMatch;
  };

  useEffect(() => {
    setSearchFilter(debouncedSearchFilter);
    resetPage();
  }, [debouncedSearchFilter]);

  useEffect(() => {
    setNameFilter(debouncedNameFilter);
    resetPage();
  }, [debouncedNameFilter]);

  useEffect(() => {
    const filteredCount = users.filter(filterUsers).length;
    setFilteredUserCount(filteredCount);
  }, [departmentFilter, titleFilter, searchFilter, nameFilter, users]);

  useEffect(() => {
    if (
      searchInputRef.current &&
      document.activeElement === searchInputRef.current
    ) {
      searchInputRef.current.focus();
    }
    if (
      nameInputRef.current &&
      document.activeElement === nameInputRef.current
    ) {
      nameInputRef.current.focus();
    }
  }, [filteredUserCount]);

  const uniqueDepartments = Array.from(new Set(users.map((user) => user.department).filter(Boolean)));
  const uniqueTitles = Array.from(new Set(users.map((user) => user.jobTitle).filter(Boolean)));

  const getCurrentPageItems = (): IUser[] => {
    const filteredUsers = users.filter(filterUsers);
    const startIndex = (currentPage - 1) * usersPerPage;
    const pageItems = filteredUsers.slice(startIndex,startIndex + usersPerPage);
    return pageItems;
  };

  const totalPages = Math.ceil(users.filter(filterUsers).length / usersPerPage);
  const navBarRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);

  const closeQRCode = (event: MouseEvent): void => {
    const target = event.target as HTMLElement;

    if (
      target.closest(".MuiSelect-select") ||
      target.closest(".MuiMenu-paper") ||
      navBarRef.current?.contains(target) ||
      target.closest(`.${profilestyle.qrContainer}`) ||
      paginationRef.current?.contains(target)
    ) {
      return; // Ignore these clicks
    }

    setShowQR({});
  };

  const toggleQR = (userId: string): void => {
    setShowQR((prev) => {
      if (prev[userId]) {
        return { ...prev, [userId]: false };
      } else {
        return { [userId]: true };
      }
    });
  };

  useLayoutEffect(() => {
    document.addEventListener("mousedown", closeQRCode);
    return () => {
      document.removeEventListener("mousedown", closeQRCode);
    };
  }, []);

  const prepareCSVData = (): (string[] | string[][])[] => {
    const filteredUsers = users.filter(filterUsers);
    const headers = [
      "Display Name",
      "Email",
      "Department",
      "Job Title",
      "Phone Number",
      "Location",
    ];

    const data = filteredUsers.map((user) => [
      user.displayName,
      user.mail || "",
      user.department || "",
      user.jobTitle || "",
      user.phoneNumber || "",
      user.location || "",
    ]);

    return [headers, ...data];
  };

  const downloadQRCode = async (user: IUser): Promise<void> => {
    const canvas = document.getElementById(
      `qr-${user.id}`
    ) as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${user.displayName}_QRCode.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const shareQRCode = async (user: IUser): Promise<void> => {
    const canvas = document.getElementById(
      `qr-${user.id}`
    ) as HTMLCanvasElement;
    if (canvas) {
      canvas.toBlob(async (blob): Promise<void> => {
        if (blob) {
          const file = new File([blob], `${user.displayName}_QRCode.png`, {
            type: "image/png",
          });
          if (navigator.share) {
            try {
              await navigator.share({
                title: `${user.displayName}'s QR Code`,
                text: "Check out this QR Code!",
                files: [file],
              });
            } catch (error) {
              console.error("Error sharing:", error);
            }
          } else {
            console.log("Web Share API not supported");
          }
        }
      });
    }
  };

  const CSVExportButton: React.FC = () => {
    const theme = useTheme();
    return (
      <CSVLink
        data={prepareCSVData()}
        filename="employee_directory.csv"
        className={currentStyle.csvExportButton}
      >
        <IconButton
          iconProps={{ iconName: "ExcelDocument" }}
          styles={{
            root: {
              color: theme.palette.neutralPrimary,
              selectors: {
                "&:hover": { color: theme.palette.themePrimary },
              },
            },
            icon: {
              fontSize: `${iconsSize}px`,
              height: `${iconsSize}px`,
            },
          }}
        />
      </CSVLink>
    );
  };
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getIconButtonStyles = (isActive: boolean = false): IButtonStyles => ({
    root: {
      color: isActive
        ? theme.palette.themePrimary
        : theme.palette.neutralPrimary,
      selectors: {
        "&:hover": { color: theme.palette.themeDarkAlt },
      },
    },
    icon: {
      fontSize: `${iconsSize}px`,
      height: `${iconsSize}px`,
    },
  });

  const clearFilterIcon: IIconProps = { iconName: "ClearFilter" };

  React.useEffect(() => {
    loadStyles("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap");}, []);

  const [showOrgTree, setShowOrgTree] = useState(false);

  const toggleOrgTree = () => {
    if(showOrgTree){
      users.forEach(user => {
        if (user.isSelected) {
          user.isSelected = false;
          setSelectedUser(null);
        }
      });
      setShowOrgTree(false);
    }
    else {
      setShowOrgTree(true);
    }
  };

  const openOrgTree = (user: IUser) => {
    // const manager = user.manager; // Get the manager from the selected user
    if (user !== null && user.manager !== undefined) {
      user.isSelected = true;
      // If the user has a manager, find the manager in the users list
      // const managerUser = users.find((u) => u.id === managerId);
      setSelectedUser(user || null); // Set the manager as the selected user
    } else if(user.id && user.manager === undefined){
      user.isSelected = true;
      setSelectedUser(user || null); // Set the user as the selected user
    } 
    else {
      setSelectedUser(null); // No manager found, set to null
    }
    setShowOrgTree(true); // Open the modal
  };

  const userMap = new Map<string, IOrgTreeNode>();
  const buildHierarchy = (root : IOrgTreeNode) : void => {
    // Loop through each user to find direct reports to the current root
    users.forEach((user) => {
      if (user.manager?.id === root.id) {
        const node = userMap.get(user.id);
        if (node) {
          // Push the direct report into the root's children
          root.children.push(node);

          // Recursively build hierarchy for each child node
          buildHierarchy(node);
        }
      }
    });
  }

  return (
    <ThemeProvider theme={theme}>
      <div key={`${departmentFilter}-${titleFilter}-${searchFilter}-${nameFilter}`} ref={topRef}>
        <div className={currentStyle.navBar} style={navBarStyle} ref={navBarRef} >
          <p className={currentStyle.navTitle}>Employee Directory</p>
            <div className={currentStyle.navButtons}>
            <p className={currentStyle.userCount}>
              {filteredUserCount}/{users.length}
            </p>
            <TooltipHost content="List view" directionalHint={DirectionalHint.bottomCenter}>
              <NavButton iconName="BulletedList" onClick={() => handleStyleChange(liststyle, "list")}isActive={activeStyle === "list"}/>
            </TooltipHost>

            <TooltipHost content="Profile view" directionalHint={DirectionalHint.bottomCenter}>
              <NavButton iconName="ContactCard" onClick={() => handleStyleChange(profilestyle, "profile")}
                isActive={activeStyle === "profile"}/>
            </TooltipHost>

            <TooltipHost content="Export to CSV" directionalHint={DirectionalHint.bottomCenter} >
              <CSVExportButton />
            </TooltipHost>
          </div>
        </div>
        <div style={filterContainerStyle}>
          <StyledTextField
            select
            label="Department"
            value={departmentFilter}
            onChange={handleDepartmentFilterChange}
            variant="outlined"
            style={filterFieldStyle}
            SelectProps={{ MenuProps: menuProps }}
          >
            {uniqueDepartments.map((option) => (
              <MenuItem key={option} value={option} style={menuItemStyle}>
                {option}
              </MenuItem>
            ))}
          </StyledTextField>

          <StyledTextField select label="Job Title"
            value={titleFilter} onChange={handleTitleFilterChange}
            variant="outlined" style={filterFieldStyle}
            SelectProps={{ MenuProps: menuProps }}>
            {uniqueTitles.map((option) => (
              <MenuItem key={option} value={option} style={menuItemStyle}>
                {option}
              </MenuItem>
            ))}
          </StyledTextField>

          <TextField label="Search" value={searchFilterInput}
            onChange={handleSearchFilterChange} variant="outlined"
            style={filterFieldStyle} inputRef={searchInputRef}/>

          <TextField label="Name" value={nameFilterInput}
            onChange={handleNameFilterChange} variant="outlined"
            style={filterFieldStyle} inputRef={nameInputRef}/>

          <TooltipHost content="Clear Filters" directionalHint={DirectionalHint.bottomCenter}>
            <IconButton
              iconProps={clearFilterIcon}
              onClick={clearFilters}
              aria-label="Clear Filters"
              styles={{
                icon: {
                  fontSize: `${iconsSize}px`,
                  height: `${iconsSize}px`,
                },
              }}
            />
          </TooltipHost>
        </div>
        {currentStyle === liststyle && (
          <div className={currentStyle.scrollContainer}>
            <div className={currentStyle.tableBody}>
              <div
                className={`${currentStyle.tableRow} ${currentStyle.headerRow}`}
                style={headerRowStyle}
              >
                <div className={currentStyle.tableCell}>Name</div>
                <div className={currentStyle.tableCell}>Department</div>
                <div className={currentStyle.tableCell}>Job Title</div>
                <div className={currentStyle.tableCell}>Email</div>
                <div className={currentStyle.tableCell}>Phone Number</div>
                <div className={currentStyle.tableCell}>Manager</div>
              </div>
              {getCurrentPageItems().map((user) => (
                <div key={user.id} className={currentStyle.tableRow}>
                  <div className={currentStyle.tableCell}>
                    {user.displayName}
                  </div>
                  <div className={currentStyle.tableCell}>
                    {user.department || "-"}
                  </div>
                  <div className={currentStyle.tableCell}>
                    {user.jobTitle || "-"}
                  </div>
                  <div className={currentStyle.tableCell}>
                    <a
                      href={`https://outlook.office.com/mail/deeplink/compose?to=${user.mail}`}
                    >
                      {user.mail}
                    </a>
                  </div>
                  <div className={currentStyle.tableCell}>
                    {user.phoneNumber || "-"}
                  </div>
                  <div className={currentStyle.tableCell}>
                    {user.manager?.displayName || "-"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStyle === profilestyle && (
          <div className={currentStyle.employees}>
            {getCurrentPageItems().map((user) => (
              <div className={currentStyle.employee} key={user.mail}>
                {currentStyle === profilestyle && (
                  <div className={currentStyle.qrContainer}>
                    <IconButton
                      iconProps={{ iconName: "QRCode" }}
                      onClick={() => toggleQR(user.id)}
                      className={currentStyle.qrToggleButton}
                      ariaLabel={
                        showQR[user.id] ? "Hide QR Code" : "Show QR Code"
                      }
                      styles={{icon: {fontSize: "16px",height: "16px",},
                      }}
                    />
                    {showQR[user.id] && (
                      <div className={currentStyle.qrCode}>
                        <QRCode id={`qr-${user.id}`} value={generateVCardData(user)} size={80}/>
                        <div> <p>{user.displayName}</p></div>
                        <div className={currentStyle.qrActions}>
                          <TooltipHost content="Download QR Code" directionalHint={DirectionalHint.bottomCenter} >
                            <IconButton iconProps={{ iconName: "Download" }} onClick={() => downloadQRCode(user)}
                              ariaLabel="Download QR Code" styles={{icon: {fontSize: "18px",height: "18px",},
                              }}/>
                          </TooltipHost>

                          <TooltipHost content="Share QR Code" directionalHint={DirectionalHint.bottomCenter}>
                            <IconButton iconProps={{ iconName: "Share" }} onClick={() => shareQRCode(user)}
                              ariaLabel="Share QR Code" styles={{icon: {fontSize: "14px",height: "14px",},}} />
                          </TooltipHost>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div className={currentStyle.profileImg}>
                  {user.profileImageUrl ? (<img src={user.profileImageUrl} alt={`${user.displayName}'s profile`}/>) : (
                    <Persona imageInitials={ user.profileImageUrl? undefined: getInitials(user.displayName)}
                      size={PersonaSize.size48} imageAlt={`${user.displayName}'s profile picture`}
                      hidePersonaDetails={true} styles={personaStyles}
                      initialsColor={mergeStyles({backgroundColor: theme.palette.themePrimary,
                      })}
                      onClick={() => window.open(`https://softflowcloud.sharepoint.com/_layouts/15/vivahomefeed.aspx#/user/${user.id}`
                        )} />
                  )}
                </div>

                <div className={currentStyle.employeeInfo}>
                  <div className={`${currentStyle.infoSection} ${currentStyle.nameSection}`}>
                    <b> <p>{user.displayName}</p></b>
                    </div>

                  <div className={currentStyle.infoSection}>
                    <p>{user.department || "\u00A0"}</p>
                    <p>{user.jobTitle || "\u00A0"}</p>
                  </div>

                  <div className={currentStyle.emailContainer}>
                    {user.mail && (<IconButton iconProps={{ iconName: "Mail" }}
                        href={`https://outlook.office.com/mail/deeplink/compose?to=${user.mail}`}
                        styles={getIconButtonStyles()} ariaLabel={`Send email to ${user.displayName}`}/>
                    )}

                    <div className={currentStyle.emailWrapper}>
                      <a href={`mailto:${user.mail}`} className={currentStyle.emailText} title={user.mail}> {user.mail}</a>
                    </div>
                  </div>
                </div>

                <div className={currentStyle.actionButtons}>
                  <TooltipHost content="Chat in Teams" directionalHint={DirectionalHint.bottomCenter} >
                    <IconButton
                      iconProps={{ iconName: "TeamsLogo" }}
                      onClick={() =>window.open(`https://teams.microsoft.com/l/chat/0/0?users=${user.mail}`)}
                      styles={{icon: {fontSize: "18px",height: "18px",},}}/>
                  </TooltipHost>
                  <TooltipHost content="Show Org Tree" directionalHint={DirectionalHint.bottomCenter}>
                    <IconButton iconProps={{ iconName: "Org" }} onClick={() => openOrgTree(user)} ariaLabel="Show Org Tree"
                      styles={{icon: {fontSize: "18px",height: "18px",},}} />
                  </TooltipHost>
                  <TooltipHost content="Email in Outlook" directionalHint={DirectionalHint.bottomCenter}>
                    <IconButton iconProps={{ iconName: "OutlookLogo" }}
                      onClick={() => window.open(`https://outlook.office.com/mail/deeplink/compose?to=${user.mail}`)}
                      styles={{icon: {fontSize: "18px",height: "18px"}}}
                    />
                  </TooltipHost>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={currentStyle.paginationContainer} ref={paginationRef}>
          <CustomPagination count={totalPages}  page={currentPage} onChange={handlePageChange}/>
        </div>
      </div>

      <Modal showModal={showOrgTree}
             modalTitle={'Organization Chart'}
             showModalTitle={true}
             onClose={toggleOrgTree}
             onSave={() => {
              // Intentionally empty
              }}
             modalClassSize={'modal-xl'}>
             {selectedUser ? (
              <OrganizationalChart context={context} employee={selectedUser || undefined} users={users} withSearch={false} />
              ) : ( <p style={{textAlign:"center"}}>No manager found.</p>)
            }
      </Modal>
    </ThemeProvider>
  );
}

export default EmployeeDirectory;
