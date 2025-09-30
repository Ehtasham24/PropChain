import { Controller, Delete, Get, Param } from '@nestjs/common';
import { PropertyService } from './properties.service';

@Controller('api/properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get()
  getAllProperties() {
    return this.propertyService.findAll();
  }

  // 2. Static path segment before parameterized routes
  @Get('history/:propertyId') // ← Changed order
  getOwnershipHistory(@Param('propertyId') propertyId: string) {
    return this.propertyService.getOwnershipHistory(propertyId);
  }

  // 3. Parameterized route last
  @Get(':propertyId')
  getProperty(@Param('propertyId') propertyId: string) {
    return this.propertyService.findOne(propertyId);
  }

  @Get('/property/active')
  getActiveProperties() {
    return this.propertyService.findActiveProperties();
  }

  @Delete()
  deleteProperty() {
    return this.propertyService.deleteProperties();
}
}
