export interface AdminCustomField {
  id: string;
  adminId: string;
  fieldName: string;
  fieldType: string;
  isRequired: boolean;
  options: Record<string, any>;
  isMultiSelect: boolean;
  created_at: string;
  updated_at: string;
}

// Define the interface for the API response when fetching custom fields.
export interface CustomFieldsResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    adminCustomFields: AdminCustomField[];
  };
}

// Define the interface for the API response when adding/updating/deleting a custom field.
export interface AddCustomFieldsResponse {
  status?: number;
  success?: boolean;
  message?: string;
  data: {
    adminCustomField: AdminCustomField;
  };
}


export interface CustomFieldsState {
  customFields: AdminCustomField[];
  loading: boolean;
  error: string | null;
}