
// ==========================================
// 🎥 TUTORIALS API ROUTES
// ==========================================

// src/app/api/tutorials/route.ts
const createTutorialSchema = z.object({
  title: z.string().min(1, "Title is required"),
  youtubeUrl: z.string().url("Invalid YouTube URL"),
  description: z.string().optional().nullable(),
});

// GET /api/tutorials
export async function GET_TUTORIALS(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tutorials = await db.tutorial.findMany({
      include: {
        createdBy: { select: { name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tutorials);
  } catch (error) {
    console.error("GET /api/tutorials error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tutorials" },
      { status: 500 },
    );
  }
}

// POST /api/tutorials
export async function POST_TUTORIAL(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validated = createTutorialSchema.parse(body);

    const tutorial = await db.tutorial.create({
      data: {
        ...validated,
        createdByUserId: session.user.id,
      },
      include: {
        createdBy: { select: { name: true, image: true } },
      },
    });

    return NextResponse.json(tutorial, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("POST /api/tutorials error:", error);
    return NextResponse.json(
      { error: "Failed to create tutorial" },
      { status: 500 },
    );
  }
}

// src/app/api/tutorials/[id]/route.ts
// GET /api/tutorials/[id]
export async function GET_TUTORIAL(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const tutorial = await db.tutorial.findUnique({
      where: { id },
      include: {
        createdBy: { select: { name: true, image: true } },
      },
    });

    if (!tutorial) {
      return NextResponse.json(
        { error: "Tutorial not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(tutorial);
  } catch (error) {
    console.error("GET /api/tutorials/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tutorial" },
      { status: 500 },
    );
  }
}

// PUT /api/tutorials/[id]
export async function PUT_TUTORIAL(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const validated = createTutorialSchema.parse(body);

    const tutorial = await db.tutorial.update({
      where: { id },
      data: validated,
      include: {
        createdBy: { select: { name: true, image: true } },
      },
    });

    return NextResponse.json(tutorial);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("PUT /api/tutorials/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update tutorial" },
      { status: 500 },
    );
  }
}

// DELETE /api/tutorials/[id]
export async function DELETE_TUTORIAL(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    await db.tutorial.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/tutorials/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete tutorial" },
      { status: 500 },
    );
  }
}