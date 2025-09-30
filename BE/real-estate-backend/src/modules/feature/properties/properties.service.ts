import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Property, PropertyDocument } from './schema/properties.schema';

@Injectable()
export class PropertyService {
  constructor(
    @InjectModel(Property.name)
    private readonly propertyModel: Model<PropertyDocument>,
  ) {}

  // ✅ Get all properties
  public async findAll(): Promise<Property[]> {
    return this.propertyModel.find().exec();
  }

  // ✅ Get a single property by propertyId
  public async findOne(propertyId: string): Promise<Property | null> {
    return this.propertyModel.findOne({ propertyId }).exec();
  }

  // ✅ Add or update a property (upsert based on propertyId)
  public async upsertProperty(
    data: Partial<Property> & { propertyId: string },
  ): Promise<Property> {
    return this.propertyModel
      .findOneAndUpdate(
        { propertyId: data.propertyId },
        { $set: data },
        { upsert: true, new: true },
      )
      .exec();
  }

  public async findActiveProperties(): Promise<Property[]> {
    try {
      return this.propertyModel.find({ isActive: true }).exec();
    } catch (error) {
      throw new Error(`Failed to find active properties: ${error.message}`);
    }
  }
  // ✅ Add a new owner to the ownership history (use when ownership changes)
  public async addToOwnershipHistory(
    propertyId: string,
    newOwner: string,
  ): Promise<Property | null> {
    return this.propertyModel
      .findOneAndUpdate(
        { propertyId },
        { $push: { ownershipHistory: newOwner } },
        { new: true },
      )
      .exec();
  }

  // ✅ Transfer ownership, mark property as sold, and deactivate it
  public async transferOwnership(
    propertyId: string,
    newOwner: string,
  ): Promise<Property | null> {
    return this.propertyModel
      .findOneAndUpdate(
        { propertyId },
        {
          $set: {
            ownerAddress: newOwner,
            isActive: false,
          },
          $push: { ownershipHistory: newOwner },
        },
        { new: true },
      )
      .exec();
  }

  // ✅ Update property status (e.g., activate or deactivate listing)
  public async updateStatus(
    propertyId: string,
    isActive: boolean,
  ): Promise<Property | null> {
    return this.propertyModel
      .findOneAndUpdate({ propertyId }, { $set: { isActive } }, { new: true })
      .exec();
  }

  public async getOwnershipHistory(propertyId: string): Promise<string[]> {
    const property = await this.propertyModel.findOne({ propertyId }).exec();
    return property ? property.ownershipHistory : [];
  }

  public async updatePrice(
    propertyId: string,
    newPrice: string,
  ): Promise<void> {
    try {
      const updatedProperty = await this.propertyModel
        .findOneAndUpdate(
          { propertyId },
          {
            $set: {
              price: newPrice,
              updatedAt: new Date(),
            },
          },
          { new: true },
        )
        .exec();

      if (!updatedProperty) {
        throw new Error(`Property ${propertyId} not found`);
      }
    } catch (error) {
      throw new Error(`Failed to update price: ${error.message}`);
    }
  }

  //Delete all records
  public async deleteProperties(): Promise<void> {
    try{
    const result =await this.propertyModel.deleteMany().exec();
    console.log(`proeprty deleted. ${result.deletedCount}`);
  }catch(err){
    throw new Error(`Failed to delete properties: ${err.message}`);
  }
  }
}
