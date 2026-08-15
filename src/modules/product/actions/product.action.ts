'use server';

import { requireAuth } from '@/libs/auth';
import { AppError } from '@/libs/utils';
import type { ActionState } from '@/types';

import { productService } from '../services/server';
import type { ProductFormDto } from '../validations';

export const productCreateAction = async (
  _: ActionState,
  dto: ProductFormDto,
): Promise<ActionState> => {
  try {
    await requireAuth();
    const data = await productService.create({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      stock: dto.stock,
    });
    return {
      status: 201,
      success: true,
      message: 'Product created successfully',
      data,
      errors: [],
      trace_id: '',
    };
  } catch (error) {
    if (error instanceof AppError) {
      return {
        status: error.status,
        success: false,
        message: error.message,
        data: null,
        errors: error.errors,
        trace_id: '',
      };
    }
    throw error;
  }
};

export const productUpdateAction = async (
  _: ActionState,
  dto: ProductFormDto,
): Promise<ActionState> => {
  try {
    await requireAuth();
    if (!dto.id) {
      return {
        status: 400,
        success: false,
        message: 'Product ID is required',
        data: null,
        errors: [],
        trace_id: '',
      };
    }
    const { id, ...payload } = dto;
    const data = await productService.update(id, payload);
    return {
      status: 200,
      success: true,
      message: 'Product updated successfully',
      data,
      errors: [],
      trace_id: '',
    };
  } catch (error) {
    if (error instanceof AppError) {
      return {
        status: error.status,
        success: false,
        message: error.message,
        data: null,
        errors: error.errors,
        trace_id: '',
      };
    }
    throw error;
  }
};

export const productDeleteAction = async (_: ActionState, id: string): Promise<ActionState> => {
  try {
    await requireAuth();
    await productService.softDelete(id);
    return {
      status: 200,
      success: true,
      message: 'Product deleted successfully',
      data: { id },
      errors: [],
      trace_id: '',
    };
  } catch (error) {
    if (error instanceof AppError) {
      return {
        status: error.status,
        success: false,
        message: error.message,
        data: null,
        errors: error.errors,
        trace_id: '',
      };
    }
    throw error;
  }
};
