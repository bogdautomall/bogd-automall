"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

export interface ComboboxOption {
  value: string; // real UUID for existing rows
  label: string;
}

/**
 * A single-select combobox where the admin can pick an existing option
 * OR type a brand-new value that doesn't exist yet. New values are
 * encoded as `__new__:<label>` and resolved into a real row by the
 * server action on submit (see lib/actions/vehicles.ts).
 */
export function CreatableCombobox({
  options,
  value,
  onChange,
  placeholder = "Сонгох...",
  emptyText = "Олдсонгүй",
  createLabel = (text: string) => `"${text}" гэж шинээр нэмэх`,
}: {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  createLabel?: (text: string) => string;
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const selectedLabel = value.startsWith("__new__:")
    ? value.slice("__new__:".length)
    : options.find((o) => o.value === value)?.label;

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(query.toLowerCase())
  );

  const exactMatch = options.some(
    (o) => o.label.toLowerCase() === query.trim().toLowerCase()
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          <span className={cn(!selectedLabel && "text-muted-foreground")}>
            {selectedLabel || placeholder}
          </span>
          <ChevronsUpDown className="size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[240px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Хайх эсвэл шинээр бичих..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {filtered.length === 0 && !query && (
              <CommandEmpty>{emptyText}</CommandEmpty>
            )}
            <CommandGroup>
              {filtered.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.label}
                  onSelect={() => {
                    onChange(opt.value);
                    setQuery("");
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "size-4",
                      value === opt.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {opt.label}
                </CommandItem>
              ))}
              {query.trim().length > 0 && !exactMatch && (
                <CommandItem
                  value={`__create__${query}`}
                  onSelect={() => {
                    onChange(`__new__:${query.trim()}`);
                    setQuery("");
                    setOpen(false);
                  }}
                >
                  <Plus className="size-4" />
                  {createLabel(query.trim())}
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
