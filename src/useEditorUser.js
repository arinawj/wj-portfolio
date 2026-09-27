import { useEffect, useState } from "react";
import { subscribeToCloudUser } from "./cloudStorage.js";

export default function useEditorUser() {
  const [user, setUser] = useState(null);

  useEffect(() => subscribeToCloudUser(setUser), []);

  return user;
}
