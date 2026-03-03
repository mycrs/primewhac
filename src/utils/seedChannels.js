
import { supabase } from '@/lib/customSupabaseClient';
import { turkishChannels } from '@/data/turkishChannels';

export const seedChannelsToSupabase = async () => {
  try {
    // Check existing channels to prevent duplicates
    const { data: existing, error: checkError } = await supabase
      .from('channels')
      .select('name');
      
    if (checkError) throw checkError;

    const existingNames = new Set(existing.map(c => c.name));
    
    // Filter out channels that already exist
    const toInsert = turkishChannels.filter(c => !existingNames.has(c.name));

    if (toInsert.length === 0) {
      return { 
        success: true, 
        count: 0, 
        message: "Tüm örnek kanallar sistemde zaten mevcut." 
      };
    }

    // Insert new channels
    const { error: insertError } = await supabase
      .from('channels')
      .insert(toInsert);

    if (insertError) throw insertError;

    return { 
      success: true, 
      count: toInsert.length, 
      message: `${toInsert.length} yeni kanal başarıyla eklendi.` 
    };
  } catch (error) {
    console.error('Error seeding channels:', error);
    return { 
      success: false, 
      error: error.message || 'Kanallar eklenirken bir hata oluştu.' 
    };
  }
};
