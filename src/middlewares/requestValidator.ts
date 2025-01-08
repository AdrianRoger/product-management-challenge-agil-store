import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import CustomError from "../helpers/customError";

type ValidationSchema = {
  [method: string]: {
    [path: string]: {
      params?: Joi.ObjectSchema;
      query?: Joi.ObjectSchema;
      body?: Joi.ObjectSchema;
    };
  };
};

export default class RequestValidator {
  private static schemas: ValidationSchema = {
    GET: {
      "/products/:id": {
        params: Joi.object({
          id: Joi.number().integer().positive().required(),
        }),
      },
      "/products/search": {
        query: Joi.object({
          product_name: Joi.string().required(),
        }),
      },
    },
    POST: {
      "/products": {
        body: Joi.object({
          product_name: Joi.string().min(5).max(50).required(),
          category: Joi.string().min(3).max(20).required(),
          stock: Joi.number().integer().min(0).required(),
          price: Joi.number().positive().required(),
        }),
      },
    },
    PUT: {
      "/products/:id": {
        params: Joi.object({
          id: Joi.number().integer().positive().required(),
        }),
        body: Joi.object({
          product_name: Joi.string().min(5).max(50).required(),
          category: Joi.string().min(3).max(20).required(),
          stock: Joi.number().integer().min(0).required(),
          price: Joi.number().positive().required(),
        }),
      },
    },
    DELETE: {
      "/products/:id": {
        params: Joi.object({
          id: Joi.number().integer().positive().required(),
        }),
      },
    },
  };

  public static validate(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const { method, path } = req;
    const normalizedPath = RequestValidator.normalizePath(method, path);

    const schemaForPath = RequestValidator.schemas[method]?.[normalizedPath];
    if (!schemaForPath) return next();

    if (schemaForPath.params) {
      const { error } = schemaForPath.params.validate(req.params);
      if (error) throw new CustomError(400, error.message);
    }

    if (schemaForPath.query) {
      const { error } = schemaForPath.query.validate(req.query);
      if (error) throw new CustomError(400, error.message);
    }

    if (schemaForPath.body) {
      const { error } = schemaForPath.body.validate(req.body);
      if (error) throw new CustomError(400, error.message);
    }

    next();
  }

  private static normalizePath(method: string, path: string): string {
    if (!/^\/products/.test(path)) {
      throw new CustomError(403, "Invalid API URL");
    }

    if (method === "PUT" || method === "DELETE") {
      return "/products/:id";
    }

    if (method === "POST") {
      return "/products";
    }

    if (method === "GET" && !/^\/products\/search$/.test(path)) {
      return "/products/:id";
    } else {
      return "/products/search";
    }
  }
}
