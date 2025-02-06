import React, { useEffect, useState } from "react";
import PriorityCards2 from "./PriorityCard2";

const Content = () => {
  const [automated, setautomated] = useState(true);
  const [selectedCard, setSelectedCard] = useState("efnwhfwhn1");
  const [priorityCard, setpriorityCard] = useState([
    [
      {
        name: "Bob Marley",
        status: "open",
        number: "292-292-2983",
        emergency: "Car Accident",
        priority: 1,
        transcript: `Caller: Theres a big accident on the road.
        Dispatcher: Okay, stay calm. Can you tell me your location?
        Caller: I'm on Airport road right now.
        Dispatcher: Okay, can I get your full name
        Caller: Bob Marley.
        Dispatcher: and whats your phone number just in case we are disconnected
        Caller: 292-292-2983.
        Dispatcher: Tell me what you see?
        Caller: theres been a car crash with two black cars.
        Dispatcher: Is eveyone fine?
        Caller: its not too bad but its blocking the major intersection.
        Dispatcher: Don't worry, help is on the way. I'm going to end the call to coordinate dispatch efforts, but you should hear back from 9-1-1 officers really soon.`,
        location: "Airport road",
        id: `efnjefnjfnwjnfj`,
      },
      {
        name: "Bruce Wayne",
        status: "open",
        number: "372-282-2839",
        emergency: "Car Crash",
        priority: 1,
        transcript: `Caller: I just saw a car accident on the road.
        Dispatcher: Okay, stay calm. Can you tell me your location?
        Caller: Yes its on Airport road .
        Dispatcher: Okay, can I get your full name
        Caller: Bruce Wayne.
        Dispatcher: and whats your phone number just in case we are disconnected
        Caller: 372-282-2839.
        Dispatcher: Tell me what you see?
        Caller: I was just driving along when i saw a huge crash between 2 cars. theres a mom and a girl in one car and a guy in the other.
        Dispatcher: Is eveyone fine?
        Caller: Yeah everyone looks fine but its blocking the major intersection.
        Dispatcher: Don't worry, help is on the way. I'm going to end the call to coordinate dispatch efforts, but you should hear back from 9-1-1 officers really soon.`,
        location: "Airport road",
        id: `efnjefnjfnwjnfj`,
      },
    ],
    [
      {
        name: "Rachel Green",
        status: "open",
        number: "1111 666 5963",
        emergency: "Being Followed",
        priority: 1,
        transcript: `Caller: Hello there is a man following me.
        Dispatcher: Okay, stay calm. Can you tell me your location?
        Caller: Yeah, I'm at the Toronto Pearson Airport.
        Dispatcher: Okay, can I get your full name
        Caller: Yeah, it's Rachel Green.
        Dispatcher: and whats your phone number just in case we are disconnected
        Caller: 1, 1, 1 6 6, 6 5, 9 6 3.
        Dispatcher: What is the health emergency?
        Caller: It's not a health emergency is a man following me and I don't feel safe.
        Dispatcher: What is the man doing?
        Caller: She just keeps looking at me, weird and falling behind me.
        Dispatcher: Don't worry, help is on the way. I'm going to end the call to coordinate dispatch efforts, but you should hear back from 9-1-1 officers really soon.`,
        location: "Toronto Pearson Airport",
        id: `vghvghvgh`,
      },
    ],
    [
      {
        name: "Tom Holland",
        status: "open",
        number: "444-333-2929",
        emergency: "Car Crash",
        priority: 2,
        transcript: `Caller: I need help im in a car crash.
        Dispatcher: Okay, stay calm. Can you tell me your location?
        Caller: Yeah, I'm on Bay and Wellington.
        Dispatcher: Okay, can I get your full name
        Caller: Yeah, it's Tom Holland.
        Dispatcher: and whats your phone number just in case we are disconnected
        Caller: 444-333-2929.
        Dispatcher: Who is in the car with you?
        Caller: Its me and my daughter.
        Dispatcher: Is anyone hurt?
        Caller: No no ones injured but we are stuck in the car.
        Dispatcher: Don't worry, help is on the way. I'm going to end the call to coordinate dispatch efforts, but you should hear back from 9-1-1 officers really soon.`,
        location: "Bay and Wellington",
        id: `juhuihiojij`,
      },
    ],
  ]);

  const [isAIMode, setIsAIMode] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [currentEmergency, setCurrentEmergency] = useState(null);
  const [currentFacility, setCurrentFacility] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const updateLabel = (e) => {
    let theCards = [];
    priorityCard.forEach((card) => {
      if (card.id == selectedCard) {
        theCards.push({
          ...card,
          priority: parseInt(e.target.value),
        });
      } else {
        theCards.push(card);
      }
    });
    setpriorityCard(theCards);
  };

  const toggleAIMode = async () => {
    const newAIMode = !isAIMode;
    setIsAIMode(newAIMode);

    if (newAIMode) {
      console.log('AI Mode Activated: Fetching all emergencies...');
      await handleAIDispatch();
    }
  };

  const handleAIDispatch = async () => {
    try {
      const emergencies = priorityCard.map(card => ({
        emergency: card.emergency,
        location: card.location,
        id: card.id,
        latitude: card.latitude,
        longitude: card.longitude,
      }));

      const facilities = await Promise.all(emergencies.map(fetchNearestFacility));

      // Show confirmation modal for each emergency
      for (let i = 0; i < emergencies.length; i++) {
        const emergency = emergencies[i];
        const facility = facilities[i];

        if (facility) {
          setShowStatusModal(true);
          setCurrentEmergency(emergency);
          setCurrentFacility(facility);
          await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before moving to the next
        } else {
          console.error(`No facility found for emergency: ${emergency.id}`);
          // Handle error (e.g., show a message)
        }
      }
    } catch (error) {
      console.error('Error in AI dispatch:', error);
      // Display error message in the UI
      setErrorMessage('Failed to fetch emergencies or facilities. Please try again.');
    }
  };

  useEffect(() => {
    if (isAIMode) {
      console.log('AI Mode Activated: All emergencies will be dispatched to the nearest facilities.');
    }
  }, [isAIMode]);

  return (
    <div className="py-8">
      {/**top bar */}
      <div>
        <div className="flex">
          <div
            onClick={toggleAIMode}
            className={`w-36 bg-white text-red-600 border-gray-300 border-[1px] items-center justify-center flex h-10 rounded-lg ${isAIMode ? 'text-white bg-red-600' : ''}`}
          >
            <h3>{isAIMode ? 'AI Mode On' : 'AI Mode Off'}</h3>
          </div>
          <div
            onClick={() => setautomated(true)}
            className={`w-36 bg-white text-red-600 border-gray-300 border-[1px]  items-center justify-center flex h-10 rounded-l-lg ${
              automated && `text-white bg-red-600`
            }`}
          >
            <h3>Automated</h3>
          </div>
          <div
            onClick={() => setautomated(false)}
            className={`w-36 items-center justify-center border-gray-300 border-[1px]  flex h-10 rounded-r-lg ${
              !automated && `text-white bg-red-600`
            } bg-white text-red-600`}
          >
            <h3>Live Attended</h3>
          </div>
        </div>
      </div>

      {/**emergencies */}
      <div className="py-8 flex gap-5 w-full overflow-x-scroll ">
        <PriorityCards2
          priority="Incomming"
          priorityCard={priorityCard}
          setpriorityCard={setpriorityCard}
          updateLabel={updateLabel}
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
        />
        <PriorityCards2
          priority="1"
          priorityCard={priorityCard}
          setpriorityCard={setpriorityCard}
          updateLabel={updateLabel}
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
        />
        <PriorityCards2
          priority="2"
          priorityCard={priorityCard}
          setpriorityCard={setpriorityCard}
          updateLabel={updateLabel}
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
        />
        <PriorityCards2
          priority="3"
          priorityCard={priorityCard}
          setpriorityCard={setpriorityCard}
          updateLabel={updateLabel}
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
        />
        <PriorityCards2
          priority="4"
          priorityCard={priorityCard}
          setpriorityCard={setpriorityCard}
          updateLabel={updateLabel}
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
        />
        <PriorityCards2
          priority="5"
          priorityCard={priorityCard}
          setpriorityCard={setpriorityCard}
          updateLabel={updateLabel}
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
        />
      </div>
    </div>
  );
};

export default Content;
