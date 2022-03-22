export interface FilterOption {
  filterName: string;
  isFiltered: boolean;
  title?: string;
}

export interface FilterCategory {
  displayName: string;
  name: string;
  filterOptions: FilterOption[];
}
