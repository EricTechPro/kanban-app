'use client';

import { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export default function TestTogglePage() {
  const [value, setValue] = useState<string>('option1');

  const handleChange = (newValue: string | undefined) => {
    console.log('Toggle change:', { current: value, new: newValue });
    if (newValue) {
      setValue(newValue);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Toggle Group Test</h1>

      <div className="space-y-4">
        <div>
          <p className="mb-2">Current value: {value}</p>
          <ToggleGroup type="single" value={value} onValueChange={handleChange}>
            <ToggleGroupItem value="option1">Option 1</ToggleGroupItem>
            <ToggleGroupItem value="option2">Option 2</ToggleGroupItem>
            <ToggleGroupItem value="option3">Option 3</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
}
