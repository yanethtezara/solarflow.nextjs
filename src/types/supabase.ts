export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.1';
  };
  public: {
    Tables: {
      catalogo_items: {
        Row: {
          created_at: string | null;
          id: string;
          nombre: string;
          precio: number;
          tipo: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          nombre: string;
          precio?: number;
          tipo: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          nombre?: string;
          precio?: number;
          tipo?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'catalogo_items_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      clientes: {
        Row: {
          created_at: string | null;
          direccion: string | null;
          id: string;
          nombre: string;
          telefono: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          direccion?: string | null;
          id?: string;
          nombre: string;
          telefono?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          direccion?: string | null;
          id?: string;
          nombre?: string;
          telefono?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'clientes_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      empresas: {
        Row: {
          contacto_responsable: string | null;
          created_at: string | null;
          direccion: string | null;
          id: string;
          nombre: string;
          telefono_contacto: string | null;
          user_id: string;
        };
        Insert: {
          contacto_responsable?: string | null;
          created_at?: string | null;
          direccion?: string | null;
          id?: string;
          nombre: string;
          telefono_contacto?: string | null;
          user_id: string;
        };
        Update: {
          contacto_responsable?: string | null;
          created_at?: string | null;
          direccion?: string | null;
          id?: string;
          nombre?: string;
          telefono_contacto?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'empresas_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string | null;
          email: string | null;
          id: string;
          nombre_completo: string | null;
          telefono: string | null;
        };
        Insert: {
          created_at?: string | null;
          email?: string | null;
          id: string;
          nombre_completo?: string | null;
          telefono?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string | null;
          id?: string;
          nombre_completo?: string | null;
          telefono?: string | null;
        };
        Relationships: [];
      };
      trabajos: {
        Row: {
          cliente_id: string;
          created_at: string | null;
          empresa_id: string | null;
          estado: string;
          fecha: string;
          hora: string;
          id: string;
          ubicacion: string | null;
          user_id: string;
        };
        Insert: {
          cliente_id: string;
          created_at?: string | null;
          empresa_id?: string | null;
          estado?: string;
          fecha: string;
          hora?: string;
          id?: string;
          ubicacion?: string | null;
          user_id: string;
        };
        Update: {
          cliente_id?: string;
          created_at?: string | null;
          empresa_id?: string | null;
          estado?: string;
          fecha?: string;
          hora?: string;
          id?: string;
          ubicacion?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'trabajos_cliente_id_fkey';
            columns: ['cliente_id'];
            isOneToOne: false;
            referencedRelation: 'clientes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'trabajos_empresa_id_fkey';
            columns: ['empresa_id'];
            isOneToOne: false;
            referencedRelation: 'empresas';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'trabajos_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      trabajos_items: {
        Row: {
          cantidad: number;
          item_id: string;
          trabajo_id: string;
        };
        Insert: {
          cantidad?: number;
          item_id: string;
          trabajo_id: string;
        };
        Update: {
          cantidad?: number;
          item_id?: string;
          trabajo_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'trabajos_items_item_id_fkey';
            columns: ['item_id'];
            isOneToOne: false;
            referencedRelation: 'catalogo_items';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'trabajos_items_trabajo_id_fkey';
            columns: ['trabajo_id'];
            isOneToOne: false;
            referencedRelation: 'trabajos';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
