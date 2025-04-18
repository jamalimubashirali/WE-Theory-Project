import { useState , useEffect } from 'react';
import { GalleryFilters } from '@/components/GalleryPage/GalleryFilters';
import { GalleryGrid } from '@/components/GalleryPage/GalleryGrid';
import { GalleryLightbox } from '@/components/GalleryPage/GalleryLightBox';
import { Container } from '@/components';
import itemsService from '@/services/items.services';
import { Skeleton } from '@/components/ui/skeleton';

function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState([]); // State to hold all items
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (
      async () => {
        setIsLoading(true);
        try {
          const response = await itemsService.getAllItems();
          setItems(response.items);
        } catch (error) {
          console.error('Error fetching items:', error);
        } finally {
          setIsLoading(false);
        }
      }
    )();
  } , []);

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.itemName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Container className="py-8 min-h-screen">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Lost & Found Gallery</h1>
        
        <GalleryFilters 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        {isLoading ? (
          (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-[400px] w-full rounded-lg" />
              ))}
            </div>
          )
        ) : (
          <GalleryGrid 
          items={filteredItems} 
          onItemClick={setSelectedItem}
        />
        )}
        
        
        {selectedItem && (
          <GalleryLightbox 
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </div>
    </Container>
  );
}

export default GalleryPage;