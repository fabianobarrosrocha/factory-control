"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { UseFormReturn } from "react-hook-form";

import { Location } from "@/types/location.types";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormLabelWithHelp } from "@/components/ui/form-label-with-help";

interface StorageLocationSelectProps {
  form: UseFormReturn;
  name: string;
  label?: string;
  helpText?: string;
}

export const StorageLocationSelect: React.FC<StorageLocationSelectProps> = ({
  form,
  name,
  label = "Local de armazenamento",
  helpText
}) => {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const resp = await axios.get("/api/locations");
        setLocations(resp.data.data || []);
      } catch (err) {
        console.error("Error fetching storage locations:", err);
      }
    };

    fetchLocations();
  }, []);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabelWithHelp htmlFor={name} label={label} helpText={helpText} />
          <Select onValueChange={field.onChange} value={field.value ?? ""}>
            <FormControl>
              <SelectTrigger id={name}>
                <SelectValue placeholder="Selecione o local de armazenamento" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.code}>
                  {location.code} - {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
