import { Response } from 'express';

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const sendCreated = (res: Response, message: string, data?: any) => {
  const response: ApiResponse = { success: true, message, data };
  res.status(201).json(response);
};

export const sendSuccess = (res: Response, message: string, data?: any) => {
  const response: ApiResponse = { success: true, message, data };
  res.status(200).json(response);
};

export const sendBadRequest = ( res: Response, message = 'InvalidRequest', data?: any ) => {
  const response: ApiResponse = { success: false, message, data };
  res.status(400).json(response);
};

export const sendUnauthorized = (res: Response, message = 'Unauthorized') => {
  const response: ApiResponse = { success: false, message };
  res.status(401).json(response);
};

export const sendForbidden = (res: Response, message = 'Forbidden') => {
  const response: ApiResponse = { success: false, message };
  res.status(403).json(response);
};

export const sendNotFound = (res: Response, message = 'Not Found') => {
  const response: ApiResponse = { success: false, message };
  res.status(404).json(response);
};
export const sendError = (res: Response, message: string, data?: any) => {
  const response: ApiResponse = { success: false, message, data };
  res.status(500).json(response);
};

export const sendUnrechable = (res: Response, message: string, data?: any) => {
  const response: ApiResponse = { success: false, message, data };
  res.status(503).json(response);
};

// Send No Content (204)
export const sendNoContent = (res: Response, message = 'No Content') => {
  const response: ApiResponse = { success: true, message };
  res.status(204).json(response); // No content in the response body
};

// Send Found (302)
export const sendFound = (res: Response, message = 'Found', data: any) => {
  const response: ApiResponse = { success: true, message, data};
  res.status(302).json(response);
};

// Send Accepted (202)
export const sendAccepted = (res: Response, message = 'Accepted', data?: any) => {
  const response: ApiResponse = { success: true, message, data };
  res.status(202).json(response);
};

// Send Conflict (409)
export const sendConflict = (res: Response, message = 'Conflict', data?: any) => {
  const response: ApiResponse = { success: false, message, data };
  res.status(409).json(response);
};

// Send Gone (410)
export const sendGone = (res: Response, message = 'Gone') => {
  const response: ApiResponse = { success: false, message };
  res.status(410).json(response);
};

// Send Precondition Failed (412)
export const sendPreconditionFailed = (res: Response, message = 'Precondition Failed', data?: any) => {
  const response: ApiResponse = { success: false, message, data };
  res.status(412).json(response);
};

// Send Unprocessable Entity (422)
export const sendUnprocessableEntity = (res: Response, message = 'Unprocessable Entity', data?: any) => {
  const response: ApiResponse = { success: false, message, data };
  res.status(422).json(response);
};

// Send Too Many Requests (429)
export const sendTooManyRequests = (res: Response, message = 'Too Many Requests', data?: any) => {
  const response: ApiResponse = { success: false, message, data };
  res.status(429).json(response);
};