import { Response, NextFunction } from 'express';
import { Lead } from '../models';
import { AppError, convertToCSV } from '../utils';
import {
  AuthRequest,
  LeadQueryParams,
  LeadStatus,
  LeadSource,
  UserRole,
  PaginatedResponse,
  ILead
} from '../types';
import { FilterQuery } from 'mongoose';

export const createLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const { name, email, status, source } = req.body;

    const lead = await Lead.create({
      name,
      email,
      status: status || LeadStatus.NEW,
      source,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

export const getLeads = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const {
      page = '1',
      limit = '10',
      status,
      source,
      search,
      sortBy = 'latest'
    } = req.query as LeadQueryParams;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    // Build filter query
    const filter: FilterQuery<ILead> = {};

    // Sales users can only see leads they created or assigned to them
    if (req.user.role === UserRole.SALES) {
      filter.$or = [
        { createdBy: req.user.id },
        { assignedTo: req.user.id }
      ];
    }

    if (status && Object.values(LeadStatus).includes(status)) {
      filter.status = status;
    }

    if (source && Object.values(LeadSource).includes(source)) {
      filter.source = source;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [{ name: searchRegex }, { email: searchRegex }]
      });
    }

    // Sort order
    const sortOrder = sortBy === 'oldest' ? 1 : -1;

    // Execute queries
    const [leads, totalItems] = await Promise.all([
      Lead.find(filter)
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limitNum)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email'),
      Lead.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalItems / limitNum);

    const response: PaginatedResponse<ILead> = {
      success: true,
      data: leads,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const lead = await Lead.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    // Check access for sales users
    if (req.user.role === UserRole.SALES) {
      const isOwner = lead.createdBy._id.toString() === req.user.id;
      const isAssigned = lead.assignedTo?._id?.toString() === req.user.id;

      if (!isOwner && !isAssigned) {
        throw new AppError('You do not have access to this lead', 403);
      }
    }

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const { name, email, status, source, assignedTo } = req.body;

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    // Check access for sales users
    if (req.user.role === UserRole.SALES) {
      const isOwner = lead.createdBy.toString() === req.user.id;
      const isAssigned = lead.assignedTo?.toString() === req.user.id;

      if (!isOwner && !isAssigned) {
        throw new AppError('You do not have permission to update this lead', 403);
      }

      // Sales users cannot reassign leads
      if (assignedTo && assignedTo !== lead.assignedTo?.toString()) {
        throw new AppError('Sales users cannot reassign leads', 403);
      }
    }

    // Update fields
    if (name) lead.name = name;
    if (email) lead.email = email;
    if (status) lead.status = status;
    if (source) lead.source = source;
    if (assignedTo !== undefined && req.user.role === UserRole.ADMIN) {
      lead.assignedTo = assignedTo;
    }

    await lead.save();

    const updatedLead = await Lead.findById(lead._id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: updatedLead
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    // Only admins or lead creators can delete
    if (req.user.role === UserRole.SALES) {
      const isOwner = lead.createdBy.toString() === req.user.id;

      if (!isOwner) {
        throw new AppError('You do not have permission to delete this lead', 403);
      }
    }

    await Lead.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const exportLeads = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const { status, source, search } = req.query as LeadQueryParams;

    // Build filter query
    const filter: FilterQuery<ILead> = {};

    // Sales users can only export their leads
    if (req.user.role === UserRole.SALES) {
      filter.$or = [
        { createdBy: req.user.id },
        { assignedTo: req.user.id }
      ];
    }

    if (status && Object.values(LeadStatus).includes(status)) {
      filter.status = status;
    }

    if (source && Object.values(LeadSource).includes(source)) {
      filter.source = source;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [{ name: searchRegex }, { email: searchRegex }]
      });
    }

    const leads = await Lead.find(filter).sort({ createdAt: -1 });

    const csv = convertToCSV(leads);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};
