"use client";

import React, { useState, useEffect } from "react";

type Room = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
};

type BookingDetails = {
  roomId: number;
  email: string;
  creditCard: string;
  expirationDate: string;
  cvv: string;
  phone: string;
};

const HomePage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    fetch("https://api.example.com/rooms")
      .then((response) => response.json())
      .then((data) => {
        setRooms(data?.rooms || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Network error. Please try again.");
        setLoading(false);
      });
  }, []);

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
  };

  const handleBookingSubmit = (details: BookingDetails) => {
    if (!validateBookingDetails(details)) {
      setBookingError("Please correct the highlighted fields.");
      return;
    }

    setLoading(true);
    fetch("https://api.example.com/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(details),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data?.success) {
          setBookingSuccess(true);
          setBookingDetails(details);
        } else {
          setBookingError("Room is no longer available. Please choose another.");
        }
        setLoading(false);
      })
      .catch(() => {
        setBookingError("Network error. Please try again.");
        setLoading(false);
      });
  };

  const validateBookingDetails = (details: BookingDetails): boolean => {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email);
    const creditCardValid = /^\d{16}$/.test(details.creditCard);
    const expirationDateValid = /^\d{2}\/\d{2}$/.test(details.expirationDate);
    const cvvValid = /^\d{3}$/.test(details.cvv);
    const phoneValid = /^\d{10}$/.test(details.phone);
    return emailValid && creditCardValid && expirationDateValid && cvvValid && phoneValid;
  };

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-4">
        <img src="https://loremflickr.com/320/240/hotel" alt="Hotel Logo" className="h-12" />
        <nav>
          <button onClick={() => setSelectedRoom(null)} className="text-blue-500">
            Rooms
          </button>
        </nav>
      </header>

      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-red-500 text-center">{error}</div>}

      {!selectedRoom && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rooms?.length ? (
            rooms.map((room) => (
              <div key={room.id} className="border p-4">
                <img src={room.image || "https://loremflickr.com/320/240/room"} alt={room.name} className="w-full h-48 object-cover" />
                <h2 className="text-xl font-bold">{room.name || "Room"}</h2>
                <p>{room.description || "Description not available."}</p>
                <p>${room.price || 0}</p>
                <button onClick={() => handleRoomSelect(room)} className="mt-2 text-blue-500">
                  View Details
                </button>
              </div>
            ))
          ) : (
            <div className="text-center">No rooms available.</div>
          )}
        </div>
      )}

      {selectedRoom && (
        <div>
          <h2 className="text-2xl font-bold">{selectedRoom.name || "Room Details"}</h2>
          <img src={selectedRoom.image || "https://loremflickr.com/320/240/room"} alt={selectedRoom.name} className="w-full h-64 object-cover" />
          <p>{selectedRoom.description || "Description not available."}</p>
          <p>${selectedRoom.price || 0}</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);
              const details: BookingDetails = {
                roomId: selectedRoom.id,
                email: formData.get("email") as string,
                creditCard: formData.get("creditCard") as string,
                expirationDate: formData.get("expirationDate") as string,
                cvv: formData.get("cvv") as string,
                phone: formData.get("phone") as string,
              };
              handleBookingSubmit(details);
            }}
            className="mt-4"
          >
            <div>
              <label>Email:</label>
              <input type="email" name="email" className="border p-2 w-full" required />
            </div>
            <div>
              <label>Credit Card:</label>
              <input type="text" name="creditCard" className="border p-2 w-full" required />
            </div>
            <div>
              <label>Expiration Date (MM/YY):</label>
              <input type="text" name="expirationDate" className="border p-2 w-full" required />
            </div>
            <div>
              <label>CVV:</label>
              <input type="text" name="cvv" className="border p-2 w-full" required />
            </div>
            <div>
              <label>Phone:</label>
              <input type="text" name="phone" className="border p-2 w-full" required />
            </div>
            <button type="submit" className="mt-4 bg-blue-500 text-white p-2">
              Book Now
            </button>
          </form>
          {bookingError && <div className="text-red-500 mt-2">{bookingError}</div>}
        </div>
      )}

      {bookingSuccess && bookingDetails && (
        <div className="text-center mt-4">
          <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
          <p>Room ID: {bookingDetails.roomId}</p>
          <p>Email: {bookingDetails.email}</p>
          <p>
            <a href="#" className="text-blue-500">
              View or Modify Booking
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default HomePage;