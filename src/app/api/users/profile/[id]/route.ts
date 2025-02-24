import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/verifyToken";
import { UpdateUserDto } from "@/utils/dtos";
import bcrypt from "bcryptjs";
import { updateUserSchema } from "@/utils/validationSchemas";
import { setCookie } from "@/utils/generateToken";
import cloudinary from "@/lib/cloudinary";

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * @method DELETE
 * @route ~/api/users/profile/:id
 * @desc  DELETE Profile
 * @access private (only user him self can delete his account)
 */
export async function DELETE(request: NextRequest, { params }: Props) {
  const {id} = await params

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        comment: true,
      },
    });
    if (!user) {
      return NextResponse.json({ message: " user not found" }, { status: 404 });
    }

    const userFromToken = verifyToken(request);

    if (userFromToken !== null && userFromToken.id === user.id) {
      // deleting the user
      if (user.photoId) {
        await cloudinary.uploader.destroy(user.photoId);
      }      
      await prisma.user.delete({ where: { id: parseInt(id) } });

      return NextResponse.json(
        { message: "your account has been deleted" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "only user him self can delete his profile, forbidden " },
      { status: 403 }
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}

/**
 * @method GET
 * @route ~/api/users/profile/:id
 * @desc  GET Profile By Id
 * @access private (only user him self can get his account)
 */
export async function GET(request: NextRequest, { params }: Props) {
  const {id} = await params

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        isAdmin: true,
      },
    });
    if (!user) {
      return NextResponse.json({ message: "user not found " }, { status: 404 });
    }
    const userFromToken = verifyToken(request);
    if (userFromToken === null || userFromToken?.id !== user.id) {
      return NextResponse.json(
        { message: " you are not allowed ,  accses denied " },
        { status: 403 }
      );
    }

    return NextResponse.json(user, { status: 200 });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
/**
 * @method PUT
 * @route ~/api/users/profile/:id
 * @desc  Update Profile
 * @access private (only user him self can get his account)
 */

export async function PUT(request: NextRequest, { params }: Props) {
  const {id} = await params
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    if (!user) {
      return NextResponse.json({ message: "user not found " }, { status: 404 });
    }
    const userFromToken = verifyToken(request);
    if (userFromToken === null || userFromToken?.id !== user.id) {
      return NextResponse.json(
        { message: " you are not allowed ,  accses denied " },
        { status: 403 }
      );
    }

    const body = (await request.json()) as UpdateUserDto;
    const validation = updateUserSchema.safeParse(body);
    if(!validation.success){
      return NextResponse.json({message:validation.error.errors[0].message}, {status:400});
    }

    // console.log(`public id = ${user.photoId}`);
    // Delete Photo From Cloudinary
    if (body.photoId && user.photoId) {
      try {
        await cloudinary.uploader.destroy(user.photoId);
        console.log(user.photoId);
      } catch (error) {
        console.error(error);
      }
    }
    
    if (body.password) {
      const salt = await bcrypt.genSalt(10);
      body.password = await bcrypt.hash(body.password, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        username: body.username,
        email: body.email,
        password: body.password,
        photoId:body.photoId
      },
      select: {
        id: true,
        email: true,
        username: true,
        photoId:true,
        createdAt: true,
        isAdmin: true,
        isVerified:true,
      },
    });
    
    const cookie = setCookie({
      id:updatedUser.id,
      username:updatedUser.username,
      isAdmin:updatedUser.isAdmin,
    }, updatedUser.isVerified)

    const headers: HeadersInit = cookie ? { "Set-Cookie": cookie } : {};

    return NextResponse.json(updatedUser, { status: 200 , headers});

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
