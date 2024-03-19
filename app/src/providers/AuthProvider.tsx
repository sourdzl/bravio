import { Profile } from "database.types";
import { supabase } from "lib/supabase";
import { Session } from "@supabase/supabase-js";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { router } from "expo-router";

type AuthData = {
  session: Session | null;
  profile: any;
  loading: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthData>({
  session: null,
  loading: true,
  profile: null,
  logout: () => null,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    // TODO kenl: api request to backend
    setSession(null);
    setProfile(null);
    setLoading(true);
    router.replace("/login");
  };

  const fetchSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    setSession(session);

    if (session) {
      // fetch profile
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single<Profile>();
      setProfile(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSession();
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ logout, session, loading, profile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
