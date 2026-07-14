import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@constructor-lab/ui-react';
import { Card, CardContent } from '@constructor-lab/ui-react';

export function CarouselBasic() {
  return (
    <Carousel className="w-full max-w-xs mx-auto">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          // eslint-disable-next-line @eslint-react/no-array-index-key -- fixed-length static demo array with no stable id
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
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
