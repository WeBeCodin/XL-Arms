import { NextRequest, NextResponse } from 'next/server';
import { RSRDatabase } from '@/lib/rsr/database';
import { RSRProductsResponse } from '@/lib/types/rsr';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '50'), 100); // Max 100 items per page
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    const manufacturer = searchParams.get('manufacturer') || undefined;
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const inStock = searchParams.get('inStock') === 'true';
    
    // Validate pagination parameters
    if (page < 1 || pageSize < 1) {
      return NextResponse.json({
        error: 'Invalid pagination parameters. Page and pageSize must be positive integers.',
      }, { status: 400 });
    }
    
    console.log(`RSR Products API: page=${page}, pageSize=${pageSize}, search="${search}"`);
    
    const database = new RSRDatabase();
    
    // Determine which database to use
    const useKV = process.env.RSR_USE_KV === 'true';
    
    if (useKV) {
      // Simple KV implementation (limited filtering capabilities)
      const products = await database.getProductsFromKV(page, pageSize);
      
      // Apply client-side filtering for KV (not ideal for large datasets)
      let filteredProducts = products;
      
      if (search) {
        const searchLower = search.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
          product.description.toLowerCase().includes(searchLower) ||
          product.manufacturerName?.toLowerCase().includes(searchLower) ||
          product.model?.toLowerCase().includes(searchLower) ||
          product.rsrStockNumber.toLowerCase().includes(searchLower)
        );
      }
      
      if (category) {
        filteredProducts = filteredProducts.filter(product =>
          product.category?.toLowerCase() === category.toLowerCase()
        );
      }
      
      if (manufacturer) {
        filteredProducts = filteredProducts.filter(product =>
          product.manufacturerName?.toLowerCase() === manufacturer.toLowerCase()
        );
      }
      
      if (minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(product => product.price >= minPrice);
      }
      
      if (maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(product => product.price <= maxPrice);
      }
      
      if (inStock) {
        filteredProducts = filteredProducts.filter(product => product.quantityOnHand > 0);
      }
      
      const response: RSRProductsResponse = {
        products: filteredProducts,
        totalCount: filteredProducts.length,
        page,
        pageSize,
        hasMore: false, // KV pagination is simplified
      };
      
      return NextResponse.json(response);
      
    } else {
      // Use Postgres with proper filtering and pagination
      let searchTerm = search;
      
      // Build advanced search term
      if (category || manufacturer || minPrice !== undefined || maxPrice !== undefined || inStock) {
        // For complex filtering, we'll need to enhance the database method
        // For now, use the search parameter
        const filters = [];
        if (category) filters.push(`category:${category}`);
        if (manufacturer) filters.push(`manufacturer:${manufacturer}`);
        if (minPrice !== undefined) filters.push(`minPrice:${minPrice}`);
        if (maxPrice !== undefined) filters.push(`maxPrice:${maxPrice}`);
        if (inStock) filters.push('inStock:true');
        
        searchTerm = [search, ...filters].filter(Boolean).join(' ');
      }
      
      const result = await database.getProductsFromPostgres(page, pageSize, searchTerm);
      
      const response: RSRProductsResponse = {
        products: result.products,
        totalCount: result.totalCount,
        page,
        pageSize,
        hasMore: (page * pageSize) < result.totalCount,
      };
      
      return NextResponse.json(response);
    }
    
  } catch (error) {
    console.error('Failed to get RSR products:', error);
    
    return NextResponse.json({
      error: 'Failed to retrieve products',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // This endpoint could be used for product searches with complex criteria
    const body = await request.json();
    const { 
      page = 1, 
      pageSize = 50, 
      filters = {},
      sortBy = 'description',
      sortOrder = 'asc'
    } = body;
    
    // Validate input
    if (page < 1 || pageSize < 1 || pageSize > 100) {
      return NextResponse.json({
        error: 'Invalid pagination parameters',
      }, { status: 400 });
    }
    
    console.log('RSR Products Search API:', { page, pageSize, filters, sortBy, sortOrder });
    
    const database = new RSRDatabase();
    
    // For now, use the basic search functionality
    // This could be enhanced to support complex filtering
    const searchTerm = filters.search || '';
    const result = await database.getProductsFromPostgres(page, pageSize, searchTerm);
    
    // Apply additional client-side filtering if needed
    let products = result.products;
    
    if (filters.category) {
      products = products.filter(p => p.category?.toLowerCase().includes(filters.category.toLowerCase()));
    }
    
    if (filters.manufacturer) {
      products = products.filter(p => p.manufacturerName?.toLowerCase().includes(filters.manufacturer.toLowerCase()));
    }
    
    if (filters.minPrice !== undefined) {
      products = products.filter(p => p.price >= filters.minPrice);
    }
    
    if (filters.maxPrice !== undefined) {
      products = products.filter(p => p.price <= filters.maxPrice);
    }
    
    if (filters.inStock) {
      products = products.filter(p => p.quantityOnHand > 0);
    }
    
    // Apply sorting
    if (sortBy && ['description', 'price', 'manufacturerName', 'quantityOnHand'].includes(sortBy)) {
      products.sort((a, b) => {
        const aVal = a[sortBy as keyof typeof a];
        const bVal = b[sortBy as keyof typeof b];
        
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          const comparison = aVal.localeCompare(bVal);
          return sortOrder === 'desc' ? -comparison : comparison;
        }
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          const comparison = aVal - bVal;
          return sortOrder === 'desc' ? -comparison : comparison;
        }
        
        return 0;
      });
    }
    
    const response: RSRProductsResponse = {
      products,
      totalCount: products.length,
      page,
      pageSize,
      hasMore: false, // Simplified for filtered results
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Failed to search RSR products:', error);
    
    return NextResponse.json({
      error: 'Failed to search products',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    }, { status: 500 });
  }
}