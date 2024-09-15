import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const mockAuth: {
  currentUser: null | { email: string; uid: string };
  signInWithEmailAndPassword: jest.Mock;
  createUserWithEmailAndPassword: jest.Mock;
  sendPasswordResetEmail: jest.Mock;
  signOut: jest.Mock;
} = {
  currentUser: null,
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  signOut: jest.fn(),
};

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => mockAuth),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => ({
    collection: jest.fn(() => ({
      addDoc: jest.fn(),
      where: jest.fn(),
      getDocs: jest.fn(),
    })),
    query: jest.fn(),
    getDocs: jest.fn(),
  })),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
}));

describe("Firebase Authentication and Firestore Mocks", () => {
  const auth = getAuth();
  const db = getFirestore();

  test("should register a new user", async () => {
    const email = "test.user@example.com";
    const password = "password123";
    const name = "Test User";

    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: { email, uid: "123" },
    });

    const mockQuerySnapshot = {
      empty: false,
      forEach: (callback: (doc: unknown) => void) => {
        callback({
          id: "1",
          data: () => ({ email, name }),
        });
      },
    };
    (getDocs as jest.Mock).mockResolvedValue(mockQuerySnapshot);

    await createUserWithEmailAndPassword(auth, email, password);

    const userCollection = collection(db, "users");
    const q = query(userCollection, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    expect(querySnapshot.empty).toBe(false);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      expect(data.email).toBe(email);
      expect(data.name).toBe(name);
    });
  });

  test("should log in a user", async () => {
    const email = "test.user@example.com";
    const password = "password123";

    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: { email, uid: "123" },
    });

    await signInWithEmailAndPassword(auth, email, password);

    mockAuth.currentUser = { email, uid: "123" };

    expect(auth.currentUser).toEqual({ email, uid: "123" });
  });
});
