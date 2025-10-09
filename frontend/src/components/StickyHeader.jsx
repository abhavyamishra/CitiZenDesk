// src/components/StickyHeader.jsx

import React, { useState } from 'react';
import { FilterBar } from './FilterBar';

// Import Shadcn components
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, SlidersHorizontal } from "lucide-react";

// The 'children' prop will be our TableHeader
export const StickyHeader = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        // This is the main sticky container.
        // `sticky top-0` makes it stick to the top of the screen.
        // `z-10` ensures it stays above the scrolling content.
        // `bg-background` is crucial to prevent content from showing through.
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-2xl font-bold">Complaints</h2>
                    <CollapsibleTrigger asChild>
                        <Button variant="outline" size="sm">
                            <SlidersHorizontal className="h-4 w-4 mr-2" />
                            Filters
                            <ChevronsUpDown className="h-4 w-4 ml-2" />
                        </Button>
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                    {/* The FilterBar is now inside the collapsible area */}
                    <div className="p-4 border-b">
                        <FilterBar />
                    </div>
                </CollapsibleContent>
            </Collapsible>
            
            {/* We render the TableHeader passed from the parent here */}
            {children}
        </div>
    );
};