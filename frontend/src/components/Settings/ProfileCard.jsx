import { useEffect, useState } from "react";
import axios from "axios";

const ProfileCard = () => {

  const [user, setUser] = useState(null);

  const [uploading, setUploading] =
    useState(false);

  useEffect(() => {

    const getProfile = async () => {

      try {

        const token =
          localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/auth/me",
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

        setUser(
          res.data.data.user
        );

      } catch (err) {

        console.log(err);

      }

    };

    getProfile();

  }, []);

  const handleImageUpload =
    async (e) => {

      const file =
        e.target.files[0];

      if (!file) return;

      try {

        setUploading(true);

        const formData =
          new FormData();

        formData.append(
          "profileImage",
          file
        );

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await axios.put(
            "http://localhost:5000/api/auth/upload-photo",
            formData,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        setUser(
          res.data.user
        );

        alert(
          "Profile photo updated successfully!"
        );

      } catch (error) {

        console.log(error);

        alert(
          "Photo upload failed"
        );

      } finally {

        setUploading(false);

      }

    };

  if (!user) {

    return (
      <div
        className="
        bg-[#0B1120]
        rounded-2xl
        p-6
        text-center
        text-gray-400"
      >
        Loading Profile...
      </div>
    );

  }

  return (

    <div className="space-y-6">

      {/* PROFILE CARD */}

      <div
        className="
        bg-[#0B1120]
        border border-orange-500/10
        rounded-2xl
        p-6"
      >

        <div className="flex flex-col items-center">

          <img
            src={
              user.profileImage
                ? user.profileImage
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name
                  )}&background=111827&color=ffffff`
            }
            alt="avatar"
            className="
            w-28 h-28
            rounded-full
            border-4
            border-orange-500
            object-cover"
          />

          <h2
            className="
            text-3xl
            font-bold
            mt-4
            text-white"
          >
            {user.name}
          </h2>

          <p
            className="
            text-gray-400
            text-sm
            mt-2"
          >
            {user.email}
          </p>

          <div
            className="
            mt-4
            px-4 py-2
            rounded-full
            bg-orange-500/10
            text-orange-400
            text-xs
            tracking-widest"
          >
            {user.role?.toUpperCase()}
          </div>

          {/* UPLOAD BUTTON */}

          <input
            type="file"
            accept="image/*"
            id="photoUpload"
            className="hidden"
            onChange={
              handleImageUpload
            }
          />

          <label
            htmlFor="photoUpload"
            className="
            mt-6
            px-5 py-2
            bg-orange-500
            hover:bg-orange-400
            text-black
            font-semibold
            rounded-lg
            cursor-pointer
            transition-all"
          >
            {uploading
              ? "Uploading..."
              : "Upload Photo"}
          </label>

        </div>

      </div>

      {/* TEAM CARD */}

      <div
        className="
        bg-[#0B1120]
        border border-orange-500/10
        rounded-2xl
        p-5"
      >

        <h3
          className="
          text-sm
          tracking-[3px]
          text-orange-400
          mb-5"
          style={{
            fontFamily:
              "Orbitron"
          }}
        >
          DEVELOPED BY TEAM DURAI
        </h3>

        <div
          className="
          space-y-4
          text-gray-300"
          style={{
            fontFamily:
              "Poppins"
          }}
        >

          <div>

            <p
              className="
              text-xs
              text-gray-500
              mb-3
              tracking-widest"
            >
              DEVELOPERS
            </p>

            <div className="space-y-2">

              <p className="hover:text-orange-400 transition-all">
                ASWIN K
              </p>

              <p className="hover:text-orange-400 transition-all">
                ANAND SWARUP
              </p>

              <p className="hover:text-orange-400 transition-all">
                SHREY SINGH
              </p>

              <p className="hover:text-orange-400 transition-all">
                MOHITH RAJ
              </p>

            </div>

          </div>

          <div
            className="
            pt-4
            border-t
            border-orange-500/10"
          >

            <p
              className="
              text-xs
              text-gray-500
              mb-2
              tracking-widest"
            >
              PROJECT
            </p>

            <p className="text-orange-400 text-sm">
              FraudGuard AI Detection System
            </p>

          </div>

          <div
            className="
            pt-4
            border-t
            border-orange-500/10"
          >

            <p
              className="
              text-xs
              text-gray-500
              mb-2
              tracking-widest"
            >
              CONTACT
            </p>

            <p className="text-orange-400 text-sm break-all">
              durai.maas.2026@gmail.com
            </p>

          </div>

        </div>

      </div>

    </div>

  );

};

export default ProfileCard;