import { get } from "svelte/store";
import { token } from "$lib/auth";
import { gzip, ungzip } from "pako";

export const getFiles = async (path: string) => {
  let add = path ? "/" + path : "";
  let res = fetch("https://api.profidev.io/cloud/dirs" + add, {
    headers: {
      Authorization: get(token),
    },
  })
    .then((res) => res.json())
    .catch((e) => {
      return [];
    });
  
  return res;
}

export const deleteFile = async (path: string) => {
  let res = fetch("https://api.profidev.io/cloud/files/" + path, {
    method: "DELETE",
    headers: {
      Authorization: get(token),
    },
  })
    .then((res) => res.json())
    .catch((e) => {
      return undefined;
    });
  
  return res;
}

export const deleteDir = async (path: string) => {
  let res = fetch("https://api.profidev.io/cloud/dirs/" + path, {
    method: "DELETE",
    headers: {
      Authorization: get(token),
    },
  })
    .then((res) => res.json())
    .catch((e) => {
      return undefined;
    });
  
  return res;
}

export const downloadSingleFile = async (path: string) => {
  let res = fetch("https://api.profidev.io/cloud/file/" + path, {
    headers: {
      Authorization: get(token),
    },
  })
    .then((res) => res.blob())
    .then(async (blob) => {
      const arrayBuffer = await new Response(blob).arrayBuffer();
      const url = window.URL.createObjectURL(new Blob([ungzip(arrayBuffer)]));
      const a = document.createElement("a");
      a.href = url;
      a.download = path.split("/").pop() || "file";
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch((e) => {
      return undefined;
    });
  
  return res;
}

export const downloadMultipleFiles = async (paths: string[]) => {
  let res = fetch("https://api.profidev.io/cloud/dirs", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: get(token),
    },
    body: JSON.stringify({ paths }),
  })
    .then((res) => res.blob())
    .then(async (blob) => {
      const arrayBuffer = await new Response(blob).arrayBuffer();
      const url = window.URL.createObjectURL(new Blob([ungzip(arrayBuffer)]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "files.zip";
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch((e) => {
      return undefined;
    });
  
  return res;
}

export const createDir = async (path: string) => {
  let res = fetch("https://api.profidev.io/cloud/dirs/" + path, {
    method: "POST",
    headers: {
      Authorization: get(token),
    },
  })
    .then((res) => res.json())
    .catch((e) => {
      return undefined;
    });
  
  return res;
}

export const renameFile = async (path: string, newPath: string) => {
  let res = fetch(`https://api.profidev.io/cloud/files/${path}?new_name=${newPath}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: get(token),
    },
  })
    .then((res) => res.json())
    .catch((e) => {
      return undefined;
    });
  
  return res;
}

export const renameDir = async (path: string, newPath: string) => {
  let res = fetch(`https://api.profidev.io/cloud/dirs/${path}?new_name=${newPath}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: get(token),
    },
  })
    .then((res) => res.json())
    .catch((e) => {
      return undefined;
    });
  
  return res;
}

export const uploadFile = async (path: string, file: File, callback: (res: any) => {}) => {
  const fileReader = new FileReader();
  fileReader.onload = async (e) => {
    const arrayBuffer = e.target?.result;
    let res = fetch("https://api.profidev.io/cloud/file/" + path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: get(token),
      },
      body: JSON.stringify({
        file: gzip(arrayBuffer as ArrayBuffer, { level: 4 })
      })
    })
      .then((res) => res.json())
      .catch((e) => {
        return undefined;
      });
    
    callback(res);
  }
  fileReader.readAsArrayBuffer(file);
}

export const checkIfExist = async (path: string) => {
  let res = fetch("https://api.profidev.io/cloud/check/" + path, {
    headers: {
      Authorization: get(token),
    },
  })
    .then((res) => res.json())
    .catch((e) => {
      return undefined;
    });
  
  return res;
}