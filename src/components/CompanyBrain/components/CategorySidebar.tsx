
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Category {
  id: string;
  name: string;
  count: number;
}

interface CategorySidebarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">Categories</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "ghost"}
              className="w-full justify-between"
              onClick={() => onSelectCategory(category.id)}
            >
              <span>{category.name}</span>
              <Badge variant="secondary">{category.count}</Badge>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategorySidebar;
