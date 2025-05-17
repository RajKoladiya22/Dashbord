
export interface TeamMember {
  id?:string;
  firstName: string;
  lastName?: string;
  email: string;
  contactNumber?: string;
  password: string;
  confirmPassword?: string;
  department?: string;
  position?: string;
  role?: string;
  status?:boolean;
  createdAt?:Date;
  address?:any;
}

// TeamMember signUp Response
export interface TeamMembersignUpResponse {
  status?: number;
  success?: boolean;
  message: string;
  teamMembers?: TeamMember;
}

// TeamState
export interface TeamState {
  teamMember?: TeamMember[];
  loading?: boolean;
  error?: string | null;
}

// TeamMember List Response
export interface TeamMemberListResponse {
  status?: number;
  success?: boolean;
  message?: string;
  teamMember?: TeamMember[];
}