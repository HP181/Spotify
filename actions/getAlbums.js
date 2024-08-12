"use server";

import { revalidatePath } from "next/cache";
import { getToken } from "next-auth/jwt"
import NextAuth from "next-auth"

async function getAlbums(req, res) {
  try {
    const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET  })
    // const token = await getToken({ NextApiRequest, secret: process.env.NEXTAUTH_SECRET });

    console.log("ttt", token);

    const getData = await fetch("https://api.spotify.com/v1/albums/4aawyAB9vmqN3uQ7FjRGTy", {
      method: 'GET',
      headers: {
        'Authorization': `Bearer BQCnVaA_geUb7LN4lO06evqlj1uBisVx59K5Ymko9UJf6DDh2qXvj6I3A3VrS-O3QpYgkWQ6DA_-EIZIC775sKc2zK_PZ0FTdjGbDwhuyqSUXS4y_Iiwh36hE0XmF-o30chZT6eMEN3BPAie3AJnYtLdtr_Y7NH9b5ysaOxlz8TRsA6b48LtoI3fpAb0gkxrN-M3v8WlsrjMFe6P-uviu7HW-mkahlP6g9-2yskDnP61yJY43ihQAba2VDGnYtFoavpPDrJKPVHqeKxu1t43WIF_laFz_Jm2ywqv6TxOWHDtbkrrvaRhJY0II8ou_t06z_Grp0CExL5qD8zqY3K7F2M`
      }
    });

    console.log("g", getData);

    const data = await getData.json();

    // Return the plain JSON object
    return {
      message: JSON.parse(JSON.stringify(data)),
      statuscode: getData?.status,
    };
  } catch (error) {
    return {
      error: error.toString(),
      status: 500,
    };
  }
}

revalidatePath("/");

export default getAlbums;
