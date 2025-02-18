import { Employee } from "./IOrganizationlChart";

export const initialOrgData: Employee = {
  id: '1',
  displayName: 'Sarah Johnson',
  jobTitle: 'CEO',
  department: 'Executive',
  mail: 'sarah.johnson@example.com',
  mobilePhone: '123-456-7890',
  profileImageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100',
  isSelected: true,
  children: [
    {
      id: '2',
      displayName: 'Michael Chen',
      jobTitle: 'CTO',
      department: 'Technology',
      mail: 'michael.chen@example.com',
      mobilePhone: '123-456-7890',
      profileImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100',
      isSelected: false,
      children: [
        {
          id: '5',
          displayName: 'Emily Rodriguez',
          jobTitle: 'Lead Developer',
          department: 'Engineering',
          mail: 'emily.rodriguez@example.com',
          mobilePhone: '123-456-7890',
          profileImageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100&h=100',
          isSelected: false,
        },
        {
          id: '6',
          displayName: 'David Kim',
          jobTitle: 'DevOps Lead',
          department: 'Operations',
          mail: 'david.kim@example.com',
          mobilePhone: '123-456-7890',
          profileImageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100&h=100',
          isSelected: false,
        }
      ]
    },
    {
      id: '3',
      displayName: 'Lisa Thompson',
      jobTitle: 'CFO',
      department: 'Finance',
      mail: 'lisa.thompson@example.com',
      mobilePhone: '123-456-7890',

      profileImageUrl: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=100&h=100',
      isSelected: false,
      children: [
        {
          id: '7',
          displayName: 'James Wilson',
          jobTitle: 'Financial Controller',
          department: 'Finance',
          mail: 'james.wilson@example.com',
          mobilePhone: '123-456-7890',
          profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100',
          isSelected: false,
        }
      ]
    },
    {
      id: '4',
      displayName: 'Robert Martinez',
      jobTitle: 'COO',
      department: 'Operations',
      mail: 'robert.martinez@example.com',
      mobilePhone: '123-456-7890',
      profileImageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100',
      isSelected: false,
      children: [
        {
          id: '8',
          displayName: 'Anna Lee',
          jobTitle: 'HR Director',
          department: 'Human Resources',
          mail: 'anna.lee@example.com',
          mobilePhone: '123-456-7890',
          profileImageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100',
          isSelected: false,

          children:[
            {
                id: '9',
                displayName: 'Hasan Yazbeck',
                jobTitle: 'Developer',
                department: 'Operations',
                mail: 'hasan.yazbeck@example.com',
                mobilePhone: '123-456-7890',
                profileImageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100',
                isSelected: false,
                children: [
                  {
                    id: '10',
                    displayName: 'Anna Lee',
                    jobTitle: 'HR Director',
                    department: 'Human Resources',
                    mail: 'anna.lee@example.com',
                    mobilePhone: '123-456-7890',
                    profileImageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100',
                    isSelected: false,
                    children: [
                        {
                            id: '11',
                            displayName: 'Anna Lee 1',
                            jobTitle: 'HR Director 1',
                            department: 'Human Resources1',
                            mail: 'anna.lee@example.com',
                            mobilePhone: '123-456-7890',
                            profileImageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100',
                            isSelected: false,
                        },
                        {
                            id: '12',
                            displayName: 'Anna Lee 2',
                            jobTitle: 'HR Director 2',
                            department: 'Human Resources2',
                            profileImageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100',
                            isSelected: false,
                        },
                        {
                            id: '13',
                            displayName: 'Anna Lee 3',
                            jobTitle: 'HR Director 3',
                            department: 'Human Resources3',
                            profileImageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100',
                            isSelected: false,
                        }
                    ]
                }
                ]
              }
        ]
        }
      ]
    }
  ]
};
