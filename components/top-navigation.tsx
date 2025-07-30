'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { User } from '@/lib/types';
import { apiClient } from '@/lib/api/client';
import {
  Search,
  Bell,
  Calendar as CalendarIcon,
  Settings,
  HelpCircle,
  LogOut,
  Youtube,
  X,
} from 'lucide-react';
import { format } from 'date-fns';

interface TopNavigationProps {
  user: User;
  onSearch?: (query: string) => void;
  onFilterStatus?: (status: string) => void;
  onFilterBrand?: (brand: string) => void;
  onFilterDateRange?: (dateRange: { from: Date; to: Date }) => void;
  onClearFilters?: () => void;
}

export function TopNavigation({
  user,
  onSearch,
  onFilterStatus,
  onFilterBrand,
  onFilterDateRange,
  onClearFilters,
}: TopNavigationProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [dateRange, setDateRange] = useState<{
    from?: Date;
    to?: Date;
  }>({});
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [brandFilter, setBrandFilter] = useState<string>('');

  const searchSuggestions = [
    'Tech Review Sponsorship',
    'Gaming Gear Partnership',
    'Lifestyle Brand Collab',
    'Software Tutorial Series',
  ];

  const statusOptions = [
    'prospecting',
    'initial-contact',
    'negotiation',
    'contract-sent',
    'contract-signed',
    'content-creation',
    'content-review',
    'published',
    'completed',
  ];

  const brandOptions = ['TechCorp', 'GameZone', 'LifeStyle Co', 'DevTools Inc'];

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setShowSearchSuggestions(value.length > 0);
    onSearch?.(value);
  };

  const handleDateRangeSelect = (range: { from?: Date; to?: Date }) => {
    setDateRange(range);
    if (range.from && range.to) {
      onFilterDateRange?.({
        from: range.from,
        to: range.to,
      });
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setBrandFilter('');
    setDateRange({});
    onClearFilters?.();
  };

  const handleLogout = async () => {
    await apiClient.logout();
  };

  const hasActiveFilters =
    searchQuery || statusFilter || brandFilter || dateRange.from;

  return (
    <div className="border-b bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Youtube className="w-4 h-4 text-white" />
              </div>
            </Avatar>
            <h1 className="text-xl font-bold text-gray-900">SponsorFlow</h1>
          </div>

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>Dashboard</BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>Sponsorship Deals</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Center Section */}
        <div className="flex items-center space-x-4 flex-1 max-w-2xl mx-8">
          {/* Global Search */}
          <div className="relative flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search deals, brands, or contacts..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 pr-4"
                onFocus={() => setShowSearchSuggestions(searchQuery.length > 0)}
                onBlur={() =>
                  setTimeout(() => setShowSearchSuggestions(false), 200)
                }
              />
            </div>

            {showSearchSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 z-50">
                <Command className="rounded-lg border shadow-md">
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                      {searchSuggestions
                        .filter((suggestion) =>
                          suggestion
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                        )
                        .map((suggestion, index) => (
                          <CommandItem
                            key={index}
                            onSelect={() => {
                              setSearchQuery(suggestion);
                              setShowSearchSuggestions(false);
                              onSearch?.(suggestion);
                            }}
                          >
                            {suggestion}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </div>
            )}
          </div>

          {/* Filter Controls */}
          <div className="flex items-center space-x-2">
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                onFilterStatus?.(value);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status
                      .replace('-', ' ')
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={brandFilter}
              onValueChange={(value) => {
                setBrandFilter(value);
                onFilterBrand?.(value);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Brand" />
              </SelectTrigger>
              <SelectContent>
                {brandOptions.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-40 justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, 'LLL dd')} -{' '}
                        {format(dateRange.to, 'LLL dd')}
                      </>
                    ) : (
                      format(dateRange.from, 'LLL dd, y')
                    )
                  ) : (
                    'Date range'
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={{
                    from: dateRange.from,
                    to: dateRange.to,
                  }}
                  onSelect={handleDateRangeSelect}
                  numberOfMonths={2}
                  required
                />
              </PopoverContent>
            </Popover>

            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-3 border-b">
                <h4 className="font-semibold">Notifications</h4>
              </div>
              <div className="p-3 space-y-2">
                <div className="text-sm">
                  <p className="font-medium">Contract due soon</p>
                  <p className="text-gray-500 text-xs">
                    Tech Review Sponsorship contract expires in 2 days
                  </p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">New message</p>
                  <p className="text-gray-500 text-xs">
                    Sarah from TechCorp sent you a message
                  </p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Payment received</p>
                  <p className="text-gray-500 text-xs">
                    $3,500 payment from GameZone processed
                  </p>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>
                    {user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
