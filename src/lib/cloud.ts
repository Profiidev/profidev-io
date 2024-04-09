import { get } from "svelte/store";
import { token } from "$lib/auth";
import { gzip, ungzip } from "pako";
import { SPEED_INTERPOLATION_STEPS } from "./constants";

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
};

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
};

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
};

export const downloadSingleFile = async (path: string, progress: (progress: number, speed: number) => void) => {
  let res = fetch("https://api.profidev.io/cloud/files/" + path, {
    headers: {
      Authorization: get(token),
    },
  })
    .then((res) => {
      if (res.status !== 200) throw new Error("Error");
      return _readBody(res, progress);
    })
    .then(async (blob) => {
      if (blob.size === 0) throw new Error("Error");
      const url = window.URL.createObjectURL(blob);
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
};

export const downloadMultipleFiles = async (path: string, paths: string[], progress: (progress: number, speed: number) => void) => {
  let toAdd = path ? "/" + path : "";
  let res = fetch("https://api.profidev.io/cloud/dirs" + toAdd, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: get(token),
    },
    body: JSON.stringify(paths),
  })
    .then((res) => {
      if (res.status !== 200) throw new Error("Error");
      return _readBody(res, progress);
    })
    .then(async (blob) => {
      if (blob.size === 0) throw new Error("Error");
      const url = window.URL.createObjectURL(blob);
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
};

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
};

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
};

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
};

export const uploadFile = async (path: string, file: File, progress: (progress: number, speed: number) => void) => {
  const fileReader = new FileReader();
  let arrayBuffer: ArrayBuffer = await new Promise((resolve) => {
    fileReader.onload = (e) => {
      const arrayBuffer = e.target?.result;
      if (!(arrayBuffer instanceof ArrayBuffer)) return;
      resolve(arrayBuffer);
    };
    fileReader.readAsArrayBuffer(file);
  });

  let blob = new Blob([arrayBuffer]);
  const totalBytes = blob.size;
  let bytesUploaded = 0;
  let lastUpdate = window.performance.now();
  let lastSpeedValues: number[] = [];

  const progressTrackingStream = new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(chunk);
      bytesUploaded += chunk.byteLength;

      let now = window.performance.now();
      let timePassed = (now - lastUpdate) / 1000;
      lastUpdate = now;
      let speed = chunk.length / timePassed;

      lastSpeedValues.push(speed);
      if (lastSpeedValues.length > SPEED_INTERPOLATION_STEPS) lastSpeedValues.shift();
      speed = lastSpeedValues.reduce((a, b) => a + b) / lastSpeedValues.length;

      progress((bytesUploaded / totalBytes) * 100, speed);
    },
    flush(controller) {
      progress(100, 0);
    },
  });

  let add = path ? "/" + path : "";
  add += "/" + file.name;
  let res = await fetch("https://api.profidev.io/cloud/files" + add, {
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
      Authorization: get(token),
    },
    body: blob.stream().pipeThrough(progressTrackingStream),
    //@ts-ignore
    duplex: "half",
  }).catch((e) => {
    return undefined;
  });

  return res;
};

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
};

export const checkIfExistMultiple = (path: string, files: string[]) => {
  let toAdd = path ? "/" + path : "";
  let res = fetch("https://api.profidev.io/cloud/check_multiple" + toAdd, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: get(token),
    },
    body: JSON.stringify(files),
  })
    .then((res) => res.json())
    .catch((e) => {
      return undefined;
    });

  return res;
};

const _readBody = async (response: Response, progress: (progress: number, speed: number) => void) => {
  if (response.body === null) return new Blob([new Uint8Array(0)]);
  const reader = response.body.getReader();

  const contentLength = +(response.headers.get("Content-Length") || 0);

  // Declare received as 0 initially
  let received = 0;
  let chunks: Uint8Array[] = [];
  let lastUpdate = window.performance.now();
  let lastSpeedValues = [];

  // Loop through the response stream and extract data chunks
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      // Finish loading
      break;
    } else {
      // Push values to the chunk array
      chunks.push(value);
      received += value.length;

      let now = window.performance.now();
      let timePassed = (now - lastUpdate) / 1000;
      lastUpdate = now;
      let speed = value.length / timePassed;

      lastSpeedValues.push(speed);
      if (lastSpeedValues.length > SPEED_INTERPOLATION_STEPS) lastSpeedValues.shift();
      speed = lastSpeedValues.reduce((a, b) => a + b) / lastSpeedValues.length;

      progress((received / contentLength) * 100, speed);
    }
  }

  // Concat the chinks into a single array
  let body = new Uint8Array(received);
  let position = 0;

  // Order the chunks by their respective position
  for (let chunk of chunks) {
    body.set(chunk, position);
    position += chunk.length;
  }

  return new Blob([body]);
};
