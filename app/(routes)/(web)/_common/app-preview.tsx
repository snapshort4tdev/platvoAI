"use client";
import React from "react";

const AppPreview = () => {
  return (
    <section className="-mt-10">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border bg-white dark:bg-background shadow-md">
        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="w-full">
            <div className="bg-background rounded-lg relative mx-auto overflow-hidden border border-transparent shadow-xl shadow-black/10 ring-1 ring-black/10">
              <div style={{ position: "relative", paddingTop: "56.25%" }}>
                <iframe
                  src="https://player.mediadelivery.net/embed/591792/787062f3-9e8a-455c-9fd2-abc360283e1c?autoplay=true&loop=true&muted=true&preload=true&responsive=true"
                  loading="lazy"
                  style={{
                    border: 0,
                    position: "absolute",
                    top: 0,
                    height: "100%",
                    width: "100%",
                  }}
                  allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
                  allowFullScreen={true}
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppPreview;
