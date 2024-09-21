export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      building_gallery_images: {
        Row: {
          alt: string | null
          building: string
          caption: string | null
          created_at: string | null
          id: number
          url: string | null
        }
        Insert: {
          alt?: string | null
          building: string
          caption?: string | null
          created_at?: string | null
          id?: number
          url?: string | null
        }
        Update: {
          alt?: string | null
          building?: string
          caption?: string | null
          created_at?: string | null
          id?: number
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "building_gallery_images_building_fkey"
            columns: ["building"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["canonical"]
          },
        ]
      }
      buildings: {
        Row: {
          aka: string | null
          always_display: boolean | null
          canonical: string
          created_at: string | null
          description: string
          display_name: string
          entry_floor: number
          floorplans_published: boolean
          further_info: string | null
          furtherinfo_display: boolean
          geometry: Json
          internal_map_size: number[]
          map_label_1: string | null
          map_label_2: string | null
          map_label_3: string | null
          opening_times: Json | null
          phys_access: string | null
          phys_access_display: boolean
          phys_access_video: string | null
          primary_image_alt: string | null
          primary_image_url: string | null
          published: boolean
          rooms_published: boolean
          sense_exp: string | null
          sense_exp_display: boolean
          sense_exp_video: string | null
          tips: string[]
          updated_at: string | null
          UUID: string
          wayfinding: string | null
          wayfinding_display: boolean
          wayfinding_video: string | null
        }
        Insert: {
          aka?: string | null
          always_display?: boolean | null
          canonical?: string
          created_at?: string | null
          description?: string
          display_name?: string
          entry_floor?: number
          floorplans_published?: boolean
          further_info?: string | null
          furtherinfo_display?: boolean
          geometry?: Json
          internal_map_size?: number[]
          map_label_1?: string | null
          map_label_2?: string | null
          map_label_3?: string | null
          opening_times?: Json | null
          phys_access?: string | null
          phys_access_display?: boolean
          phys_access_video?: string | null
          primary_image_alt?: string | null
          primary_image_url?: string | null
          published?: boolean
          rooms_published?: boolean
          sense_exp?: string | null
          sense_exp_display?: boolean
          sense_exp_video?: string | null
          tips: string[]
          updated_at?: string | null
          UUID?: string
          wayfinding?: string | null
          wayfinding_display?: boolean
          wayfinding_video?: string | null
        }
        Update: {
          aka?: string | null
          always_display?: boolean | null
          canonical?: string
          created_at?: string | null
          description?: string
          display_name?: string
          entry_floor?: number
          floorplans_published?: boolean
          further_info?: string | null
          furtherinfo_display?: boolean
          geometry?: Json
          internal_map_size?: number[]
          map_label_1?: string | null
          map_label_2?: string | null
          map_label_3?: string | null
          opening_times?: Json | null
          phys_access?: string | null
          phys_access_display?: boolean
          phys_access_video?: string | null
          primary_image_alt?: string | null
          primary_image_url?: string | null
          published?: boolean
          rooms_published?: boolean
          sense_exp?: string | null
          sense_exp_display?: boolean
          sense_exp_video?: string | null
          tips?: string[]
          updated_at?: string | null
          UUID?: string
          wayfinding?: string | null
          wayfinding_display?: boolean
          wayfinding_video?: string | null
        }
        Relationships: []
      }
      floorplans: {
        Row: {
          building: string
          created_at: string
          id: number
          label: string
          level: number
          url: string
        }
        Insert: {
          building: string
          created_at?: string
          id?: number
          label: string
          level: number
          url: string
        }
        Update: {
          building?: string
          created_at?: string
          id?: number
          label?: string
          level?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "floorplans_building_fkey"
            columns: ["building"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["UUID"]
          },
        ]
      }
      flyovers: {
        Row: {
          created_at: string
          id: number
          label: string
          location: number[]
          target: number[]
        }
        Insert: {
          created_at?: string
          id?: number
          label: string
          location: number[]
          target: number[]
        }
        Update: {
          created_at?: string
          id?: number
          label?: string
          location?: number[]
          target?: number[]
        }
        Relationships: []
      }
      logs: {
        Row: {
          action: string | null
          created_at: string
          data: Json | null
          id: number
          subject: string | null
          user: string | null
        }
        Insert: {
          action?: string | null
          created_at?: string
          data?: Json | null
          id?: number
          subject?: string | null
          user?: string | null
        }
        Update: {
          action?: string | null
          created_at?: string
          data?: Json | null
          id?: number
          subject?: string | null
          user?: string | null
        }
        Relationships: []
      }
      nav_nodes: {
        Row: {
          building: string
          created_at: string
          id: number
          label: string
          location_down: number[]
          location_up: number[]
          node_type: string
          presence: boolean[]
        }
        Insert: {
          building: string
          created_at?: string
          id?: number
          label: string
          location_down?: number[]
          location_up?: number[]
          node_type?: string
          presence?: boolean[]
        }
        Update: {
          building?: string
          created_at?: string
          id?: number
          label?: string
          location_down?: number[]
          location_up?: number[]
          node_type?: string
          presence?: boolean[]
        }
        Relationships: [
          {
            foreignKeyName: "nav_nodes_building_fkey"
            columns: ["building"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["UUID"]
          },
        ]
      }
      overlays: {
        Row: {
          bounds: number[]
          created_at: string
          high_detail: boolean
          id: number
          url: string
          url_dark: string | null
        }
        Insert: {
          bounds?: number[]
          created_at?: string
          high_detail?: boolean
          id?: number
          url?: string
          url_dark?: string | null
        }
        Update: {
          bounds?: number[]
          created_at?: string
          high_detail?: boolean
          id?: number
          url?: string
          url_dark?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          buildings: Json | null
          created_at: string | null
          email: string
          is_admin: boolean
          map: Json | null
          spaces: Json | null
          user_id: string
        }
        Insert: {
          buildings?: Json | null
          created_at?: string | null
          email?: string
          is_admin?: boolean
          map?: Json | null
          spaces?: Json | null
          user_id?: string
        }
        Update: {
          buildings?: Json | null
          created_at?: string | null
          email?: string
          is_admin?: boolean
          map?: Json | null
          spaces?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          aka: string
          building: string
          capacity: number
          hearing_loop: boolean
          id: number
          lecturn: boolean
          modified_at: string
          outlets: boolean
          projector: boolean
          room_code: string
          room_name: string
          room_type: string
          wheelchair: boolean
          whiteboard: boolean
        }
        Insert: {
          aka: string
          building: string
          capacity?: number
          hearing_loop?: boolean
          id?: number
          lecturn?: boolean
          modified_at?: string
          outlets?: boolean
          projector?: boolean
          room_code: string
          room_name: string
          room_type?: string
          wheelchair?: boolean
          whiteboard?: boolean
        }
        Update: {
          aka?: string
          building?: string
          capacity?: number
          hearing_loop?: boolean
          id?: number
          lecturn?: boolean
          modified_at?: string
          outlets?: boolean
          projector?: boolean
          room_code?: string
          room_name?: string
          room_type?: string
          wheelchair?: boolean
          whiteboard?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "rooms_building_fkey"
            columns: ["building"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["canonical"]
          },
        ]
      }
      site_settings: {
        Row: {
          data: Json
          id: number
          key: string
        }
        Insert: {
          data: Json
          id?: number
          key: string
        }
        Update: {
          data?: Json
          id?: number
          key?: string
        }
        Relationships: []
      }
      space_gallery_images: {
        Row: {
          alt: string | null
          caption: string | null
          created_at: string
          id: number
          space: string | null
          url: string | null
        }
        Insert: {
          alt?: string | null
          caption?: string | null
          created_at?: string
          id?: number
          space?: string | null
          url?: string | null
        }
        Update: {
          alt?: string | null
          caption?: string | null
          created_at?: string
          id?: number
          space?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "space_gallery_images_space_fkey"
            columns: ["space"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["UUID"]
          },
        ]
      }
      space_styles: {
        Row: {
          category: string
          colour: string | null
          created_at: string
          descriptor: string | null
          icon: string
          id: number
        }
        Insert: {
          category: string
          colour?: string | null
          created_at?: string
          descriptor?: string | null
          icon: string
          id?: number
        }
        Update: {
          category?: string
          colour?: string | null
          created_at?: string
          descriptor?: string | null
          icon?: string
          id?: number
        }
        Relationships: []
      }
      spaces: {
        Row: {
          aka: string | null
          building: string | null
          building_uuid: string | null
          canonical: string
          clickthrough: boolean | null
          description: string
          floor: number
          food_drink_allowed: boolean
          food_drink_allowed_note: string
          further_info: string
          further_info_display: boolean
          icon_override: string | null
          kettle: boolean
          kettle_note: string
          location: number[] | null
          location_internal: number[]
          microwave: boolean
          microwave_note: string
          name: string
          opening_times: Json | null
          outlets: boolean
          outlets_note: string
          phys_access: string
          phys_access_display: boolean
          phys_access_video: string | null
          primary_image_alt: string | null
          primary_image_panorama: boolean
          primary_image_url: string | null
          published: boolean
          seating: boolean
          seating_note: string
          sense_exp: string
          sense_exp_display: boolean
          sense_exp_video: string | null
          tips: string[]
          type: string
          updated_at: string
          updated_by: string | null
          UUID: string
          wayfinding: string
          wayfinding_display: boolean
          wayfinding_video: string | null
          wheelchair: boolean
          wheelchair_note: string
        }
        Insert: {
          aka?: string | null
          building?: string | null
          building_uuid?: string | null
          canonical: string
          clickthrough?: boolean | null
          description?: string
          floor?: number
          food_drink_allowed?: boolean
          food_drink_allowed_note?: string
          further_info?: string
          further_info_display?: boolean
          icon_override?: string | null
          kettle?: boolean
          kettle_note?: string
          location?: number[] | null
          location_internal?: number[]
          microwave?: boolean
          microwave_note?: string
          name: string
          opening_times?: Json | null
          outlets?: boolean
          outlets_note?: string
          phys_access?: string
          phys_access_display?: boolean
          phys_access_video?: string | null
          primary_image_alt?: string | null
          primary_image_panorama?: boolean
          primary_image_url?: string | null
          published?: boolean
          seating?: boolean
          seating_note?: string
          sense_exp?: string
          sense_exp_display?: boolean
          sense_exp_video?: string | null
          tips?: string[]
          type: string
          updated_at?: string
          updated_by?: string | null
          UUID?: string
          wayfinding?: string
          wayfinding_display?: boolean
          wayfinding_video?: string | null
          wheelchair?: boolean
          wheelchair_note?: string
        }
        Update: {
          aka?: string | null
          building?: string | null
          building_uuid?: string | null
          canonical?: string
          clickthrough?: boolean | null
          description?: string
          floor?: number
          food_drink_allowed?: boolean
          food_drink_allowed_note?: string
          further_info?: string
          further_info_display?: boolean
          icon_override?: string | null
          kettle?: boolean
          kettle_note?: string
          location?: number[] | null
          location_internal?: number[]
          microwave?: boolean
          microwave_note?: string
          name?: string
          opening_times?: Json | null
          outlets?: boolean
          outlets_note?: string
          phys_access?: string
          phys_access_display?: boolean
          phys_access_video?: string | null
          primary_image_alt?: string | null
          primary_image_panorama?: boolean
          primary_image_url?: string | null
          published?: boolean
          seating?: boolean
          seating_note?: string
          sense_exp?: string
          sense_exp_display?: boolean
          sense_exp_video?: string | null
          tips?: string[]
          type?: string
          updated_at?: string
          updated_by?: string | null
          UUID?: string
          wayfinding?: string
          wayfinding_display?: boolean
          wayfinding_video?: string | null
          wheelchair?: boolean
          wheelchair_note?: string
        }
        Relationships: [
          {
            foreignKeyName: "spaces_building_fkey"
            columns: ["building"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["canonical"]
          },
          {
            foreignKeyName: "spaces_building_uuid_fkey"
            columns: ["building_uuid"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["UUID"]
          },
          {
            foreignKeyName: "spaces_type_fkey"
            columns: ["type"]
            isOneToOne: false
            referencedRelation: "space_styles"
            referencedColumns: ["category"]
          },
          {
            foreignKeyName: "spaces_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_user_permissions: {
        Args: {
          event: Json
        }
        Returns: Json
      }
      custom_access_token_hook: {
        Args: {
          event: Json
        }
        Returns: Json
      }
      get_user_permissions: {
        Args: {
          user_uuid: string
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
        }[]
      }
      operation: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

