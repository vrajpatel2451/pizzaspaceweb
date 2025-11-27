import { getProducts } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "8", 10);
    const categoryId = searchParams.get("categoryId") || undefined;
    const search = searchParams.get("search") || undefined;
    const storeId = searchParams.get("storeId") || undefined;

    const response = await getProducts({
      page,
      limit,
      categoryId,
      search,
      storeId,
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        statusCode: 500,
        data: {
          data: [],
          meta: {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
            itemsPerPage: 8,
            hasNextPage: false,
            hasPrevPage: false,
          },
        },
      },
      { status: 500 }
    );
  }
}
