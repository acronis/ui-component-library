import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@constructor-lab/ui-react';
import { Card, CardContent } from '@constructor-lab/ui-react';

export function CarouselImageGallery() {
  return (
    <Carousel className="w-full max-w-lg mx-auto">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          // eslint-disable-next-line @eslint-react/no-array-index-key -- fixed-length static demo array with no stable id
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-video items-center justify-center p-6 bg-gradient-to-br from-blue-100 to-blue-200">
                  <div className="text-center">
                    <div className="text-6xl mb-2">🖼️</div>
                    <p className="text-sm text-gray-600">Image {index + 1}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
