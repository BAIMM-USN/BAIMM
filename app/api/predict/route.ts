import { NextRequest, NextResponse } from "next/server";
import { initializeApp, cert, getApps, App } from "firebase-admin/app";
// import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Only initialize once
let adminApp: App | undefined;
if (!getApps().length) {
  adminApp = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
} else {
  adminApp = getApps()[0];
}

// const auth = getAuth(adminApp);
const db = getFirestore(adminApp);

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Missing or invalid Authorization header" },
      { status: 401 }
    );
  }
//   const idToken = authHeader.split(" ")[1];
  try {
    // const decodedToken = await auth.verifyIdToken(idToken);
    // const uid = decodedToken.uid;
    // Fetch predictions for this user from Firestore (adjust collection as needed)
    const predictionsSnap = await db.collection("predictions").get();
    const predictions = predictionsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json({ predictions });
  } catch (error: unknown) {
    let message = "Unauthorized";
    if (
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof (error as { message?: unknown }).message === "string"
    ) {
      message = (error as { message: string }).message;
    }
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export const dynamic = "force-dynamic"; // Ensure this runs as a serverless function
