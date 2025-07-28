import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Header from "@/components/Header";
import { generateRandomUsername } from "../lib/utils";
import { Pencil } from "lucide-react";

const AVATAR_PLACEHOLDER = "https://api.dicebear.com/7.x/bottts/svg?seed=placeholder";

const DICEBEAR_SEEDS = [
  "cat", "dog", "fox", "owl", "lion", "tiger", "bear", "koala", "panda", "shark", "wolf", "rabbit", "frog", "monkey", "parrot"
];
const DICEBEAR_STYLE = "bottts";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [selected, setSelected] = useState<'informace' | 'nastaveni' | 'logout'>('informace');
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);

  // Fetch user and profile
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (data.user) {
        // Try to fetch profile
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', data.user.id)
          .single();
        if (profileData) {
          setProfile(profileData);
          setUsername(profileData.username);
        } else {
          // If no profile, create one with random username
          const randomUsername = generateRandomUsername();
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert([{ user_id: data.user.id, username: randomUsername }])
            .select()
            .single();
          if (newProfile) {
            setProfile(newProfile);
            setUsername(newProfile.username);
          }
        }
      }
    });
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const handleEditUsername = () => {
    setEditing(true);
    setUsernameError(null);
  };

  const handleSaveUsername = async () => {
    setUsernameLoading(true);
    setUsernameError(null);
    if (!username.trim()) {
      setUsernameError("Uživatelské jméno nesmí být prázdné.");
      setUsernameLoading(false);
      return;
    }
    const { error, data } = await supabase
      .from('profiles')
      .update({ username })
      .eq('user_id', user.id)
      .select()
      .single();
    if (error) {
      setUsernameError("Toto uživatelské jméno je již obsazené nebo došlo k chybě.");
    } else {
      setProfile(data);
      setEditing(false);
    }
    setUsernameLoading(false);
  };

  // Avatar upload handler
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !user) return;
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}.${fileExt}`;

    setAvatarUploading(true);
    setUsernameError(null);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setUsernameError("Chyba při nahrávání obrázku.");
      setAvatarUploading(false);
      return;
    }

    // Get public URL
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    const publicUrl = data.publicUrl;

    // Update profile
    const { error: updateError, data: updatedProfile } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      setUsernameError("Chyba při ukládání URL obrázku.");
    } else {
      setProfile(updatedProfile);
    }
    setAvatarUploading(false);
    setAvatarModalOpen(false);
  };

  // Select a DiceBear avatar
  const handleSelectDiceBear = async (seed: string) => {
    if (!user) return;
    const url = `https://api.dicebear.com/7.x/${DICEBEAR_STYLE}/svg?seed=${seed}`;
    const { error, data } = await supabase
      .from('profiles')
      .update({ avatar_url: url })
      .eq('user_id', user.id)
      .select()
      .single();
    if (!error && data) {
      setProfile(data);
      setAvatarModalOpen(false);
    }
  };

  let content;
  if (!user || !profile) {
    content = <div>Načítání profilu...</div>;
  } else if (selected === 'informace') {
    content = (
      <div>
        <h2 className="text-2xl font-bold mb-4">Informace</h2>
        <div className="flex items-center gap-8 mb-4">
          {/* Avatar and change button */}
          <div className="flex flex-col items-center">
            <img
              src={profile.avatar_url || AVATAR_PLACEHOLDER}
              alt="Avatar"
              className="w-24 h-24 rounded-full border mb-2 object-cover"
            />
            <button
              className="text-primary underline"
              onClick={() => setAvatarModalOpen(true)}
              disabled={avatarUploading}
            >
              Změnit obrázek
            </button>
          </div>
          {/* User info */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <b>Přezdívka:</b>
              {editing ? (
                <>
                  <input
                    className="border rounded px-2 py-1 text-base"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    disabled={usernameLoading}
                    maxLength={32}
                  />
                  <button
                    className="ml-2 bg-primary text-white px-3 py-1 rounded"
                    onClick={handleSaveUsername}
                    disabled={usernameLoading}
                  >
                    Uložit
                  </button>
                  <button
                    className="ml-2 text-muted-foreground underline"
                    onClick={() => { setEditing(false); setUsername(profile.username); }}
                    disabled={usernameLoading}
                  >
                    Zrušit
                  </button>
                  {usernameError && <div className="text-red-500 text-sm mt-1">{usernameError}</div>}
                </>
              ) : (
                <>
                  <span className="font-mono">{profile.username}</span>
                  <button
                    className="ml-1 text-primary hover:text-primary/80 p-1 rounded"
                    onClick={handleEditUsername}
                    aria-label="Upravit přezdívku"
                  >
                    <Pencil size={18} />
                  </button>
                </>
              )}
            </div>
            <div className="mb-2">
              <b>Email:</b> {user.email}
            </div>
          </div>
        </div>
        {/* Avatar Modal */}
        {avatarModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-card rounded-lg shadow-lg p-4 md:p-6 w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-lg text-muted-foreground hover:text-foreground"
                onClick={() => setAvatarModalOpen(false)}
                aria-label="Zavřít"
              >
                ×
              </button>
              <h3 className="text-lg md:text-xl font-bold mb-4">Změnit profilový obrázek</h3>
              <div className="mb-4">
                <div className="mb-2 text-muted-foreground text-sm md:text-base">Vyber si avatar nebo nahraj vlastní obrázek:</div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 md:gap-3 mb-4">
                  {DICEBEAR_SEEDS.map(seed => (
                    <button
                      key={seed}
                      className="focus:outline-none"
                      onClick={() => handleSelectDiceBear(seed)}
                      title={seed}
                    >
                      <img
                        src={`https://api.dicebear.com/7.x/${DICEBEAR_STYLE}/svg?seed=${seed}`}
                        alt={seed}
                        className="w-12 h-12 rounded-full border hover:ring-2 hover:ring-primary transition"
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <label className="cursor-pointer bg-primary text-white px-4 py-2 rounded shadow hover:bg-primary/90">
                  {avatarUploading ? "Nahrávám..." : "Nahrát vlastní obrázek"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={avatarUploading}
                  />
                </label>
                {usernameError && <div className="text-red-500 text-sm mt-1">{usernameError}</div>}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } else if (selected === 'nastaveni') {
    content = (
      <div>
        <h2 className="text-2xl font-bold mb-4">Nastavení</h2>
        <div className="mb-2">Zde bude možnost změnit jméno (coming soon).</div>
      </div>
    );
  } else if (selected === 'logout') {
    content = (
      <div>
        <button
          className="w-full bg-red-500 text-white py-2 rounded"
          onClick={handleLogout}
          disabled={loading}
        >
          {loading ? "Odlašuji..." : "Odhlásit se"}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex flex-col lg:flex-row justify-center items-start max-w-4xl mx-auto mt-8 md:mt-12 gap-4 md:gap-8 px-4 md:px-6">
        {/* Sidebar */}
        <div className="w-full lg:w-56 bg-card rounded-lg shadow-md p-4 md:p-6 flex flex-row lg:flex-col gap-2 md:gap-4">
          <button
            className={`text-left px-2 py-2 rounded transition-colors ${selected === 'informace' ? 'bg-primary text-white' : 'hover:bg-accent'}`}
            onClick={() => setSelected('informace')}
          >
            Informace
          </button>
          <button
            className={`text-left px-2 py-2 rounded transition-colors ${selected === 'nastaveni' ? 'bg-primary text-white' : 'hover:bg-accent'}`}
            onClick={() => setSelected('nastaveni')}
          >
            Nastavení
          </button>
          <button
            className={`text-left px-2 py-2 rounded transition-colors ${selected === 'logout' ? 'bg-destructive text-white' : 'hover:bg-destructive/80'}`}
            onClick={() => setSelected('logout')}
          >
            Odhlásit se
          </button>
        </div>
        {/* Main Content */}
        <div className="flex-1 bg-card rounded-lg shadow-md p-4 md:p-8 w-full lg:min-w-[300px] lg:max-w-lg">
          {content}
        </div>
      </div>
    </div>
  );
};

export default Profile;
