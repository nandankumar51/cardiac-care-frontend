export interface DoctorFilters {
    sortBy: 'price-low-high' | 'experience' | '';
    specialities: string[];
    consultationType: 'video' | 'in-clinic' | 'all';
    search: string;
}

// Optional: Add any helper types or constants
export const CONSULTATION_TYPES = ['video', 'in-clinic', 'all'] as const;
export const SORT_OPTIONS = ['price-low-high', 'experience', ''] as const;
export const SPECIALITIES = [
    'General Physician',
    'Cardiologist',
    'Neurologist',
    'Oncologist'
] as const;