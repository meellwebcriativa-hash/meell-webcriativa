import { supabase } from "@/integrations/supabase/client";

export const MAX_UPLOAD_MB = 10;
export const MAX_PHOTOS = 10;

function safeName(name: string) {
  const dot = name.lastIndexOf(".");
  const ext = dot > -1 ? name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "jpg";
  return `${crypto.randomUUID()}.${ext || "jpg"}`;
}

/** Uploads files to the private bucket under the user's own folder. Returns storage paths. */
export async function uploadUserFiles(userId: string, folder: string, files: File[]) {
  const paths: string[] = [];
  for (const file of files) {
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
      throw new Error(`O arquivo "${file.name}" passa de ${MAX_UPLOAD_MB} MB.`);
    }
    const path = `${userId}/${folder}/${safeName(file.name)}`;
    const { error } = await supabase.storage.from("uploads").upload(path, file, { contentType: file.type });
    if (error) throw new Error(`Não foi possível enviar "${file.name}".`);
    paths.push(path);
  }
  return paths;
}

export async function signedUrls(paths: string[]) {
  if (paths.length === 0) return {} as Record<string, string>;
  const { data } = await supabase.storage.from("uploads").createSignedUrls(paths, 60 * 60);
  const map: Record<string, string> = {};
  for (const item of data ?? []) if (item.path && item.signedUrl) map[item.path] = item.signedUrl;
  return map;
}
