
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
type TablesRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

export function useSupabaseGet<T extends keyof Database['public']['Tables']>(
  tableName: T
) {
  type RowType = TablesRow<T>;
  const [data, setData] = useState<RowType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: fetchedData, error: fetchError } = await supabase
        .from(tableName)
        .select('*');
      
      if (fetchError) throw new Error(fetchError.message);
      
      // Explicit type assertion with unknown as intermediate step
      setData(fetchedData as unknown as RowType[]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, fetchData };
}

export function useSupabaseGetById<T extends keyof Database['public']['Tables']>(
  tableName: T
) {
  type RowType = TablesRow<T>;
  const [data, setData] = useState<RowType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchById = async (id: string) => {
    setIsLoading(true);
    try {
      const { data: fetchedData, error: fetchError } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id as any)
        .single();
      
      if (fetchError) throw new Error(fetchError.message);
      
      // Explicit type assertion with unknown as intermediate step
      setData(fetchedData as unknown as RowType);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, fetchById };
}

export function useSupabaseCreate<T extends keyof Database['public']['Tables']>(
  tableName: T
) {
  type InsertType = TablesInsert<T>;
  type RowType = TablesRow<T>;
  const [data, setData] = useState<RowType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = async (record: InsertType) => {
    setIsLoading(true);
    try {
      // Use type assertion for the record parameter
      const { data: createdData, error: createError } = await supabase
        .from(tableName)
        .insert(record as any)
        .select()
        .single();
      
      if (createError) throw new Error(createError.message);
      
      // Explicit type assertion with unknown as intermediate step
      const typedData = createdData as unknown as RowType;
      setData(typedData);
      return typedData;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, create };
}

export function useSupabaseUpdate<T extends keyof Database['public']['Tables']>(
  tableName: T
) {
  type RowType = TablesRow<T>;
  const [data, setData] = useState<RowType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = async (id: string, updates: Partial<TablesInsert<T>>) => {
    setIsLoading(true);
    try {
      const { data: updatedData, error: updateError } = await supabase
        .from(tableName)
        .update(updates as any)
        .eq('id', id as any)
        .select()
        .single();
      
      if (updateError) throw new Error(updateError.message);
      
      // Explicit type assertion with unknown as intermediate step
      const typedData = updatedData as unknown as RowType;
      setData(typedData);
      return typedData;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, update };
}
