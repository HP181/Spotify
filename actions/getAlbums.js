"use server";
import { getToken } from "next-auth/jwt";

import { revalidatePath } from "next/cache";

async function getAlbums() {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    console.log("t", token);

    const getData = await fetch("https://api.spotify.com/v1/me/albums", {
        method: 'GET',
          headers: {
            'Authorization': `Bearer BQC2Ji0B382zhiKBBR8v7WlE7romES2gQrzFL5zYyjU_RcdMptACA9HMlamXveN8FkxJ2q0kJK1qTM_rxbiYUzItVd1G7JTR8I45oBnj6b8t1RcCghwVwqb2gGKSujmZ_EldfrXoZQMeAOjqUU77ovL21PO8b6aH37_KoCX8wC2yC0PlhCQ9S65v_5YvzMQ2V71Uf9iK69RCh0y5MjFVHak5zcVX6wKuF6QfoO87cwXmb6DRdlkPjSCmGUtgUCO9RQU92BHiHqCunuGr-rEgwAJy1c8NIV_lErcYAOJBiUl8BF3us39dfuYSHAdyLS-hJLe0LxxeNQ`
          }
    })

    const a = await getData.json();

    console.log("a",a);

    return {
      message: a,
      status: "fetched",
      statuscode: "201",
    };
  } catch (error) {
    return {
      error: error,
      status: 500,
    };
  }
}

revalidatePath("/");

export default getAlbums;
