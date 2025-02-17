import { DOMAIN } from "@/utils/constants";
import { User } from "@prisma/client";

  // get profile by id
export async function getProfile(userId:string) : Promise<User>{

    const response = await fetch(`${DOMAIN}/api/users/profile/${userId}`);
    if(!response.ok){
        throw new Error("Failed to fetch article");
      }
    return response.json();
} 