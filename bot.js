const { Wechaty } = require("wechaty");

async function main() {
  const bot = new Wechaty();

  bot
    .on("scan", (qrcode, status) =>
      console.log(
        `Scan QR Code to login: ${status}\nhttps://wechaty.js.org/qrcode/${encodeURIComponent(
          qrcode
        )}`
      )
    )
    .on("login", (user) => console.log(`User ${user} logged in`))
    .on("message", (message) => console.log(`Message: ${message}`))
    .on("friendship", async (friendship) => {
      try {
        console.log(`received friend event.`);
        switch (friendship.type()) {
          // 1. New Friend Request

          case bot.Friendship.Type.Receive:
            const result = await friendship.accept();
            if (result) {
              console.log(
                `Request from ${friendship
                  .contact()
                  .name()} is accept succesfully!`
              );
            } else {
              console.log(
                `Request from ${friendship.contact().name()} failed to accept!`
              );
            }

            let room = await bot.Room.find({ topic: "沭阳微社区1群" }); // change 'wechat' to any room topic in your wechat

            if (room) {
              try {
                console.log(
                  `invite contact: ${friendship.contact().name()} add room`
                );
                await room.add(contact);
              } catch (e) {
                console.error(e);
              }
            }

            break;

          // 2. Friend Ship Confirmed

          case bot.Friendship.Type.Confirm:
            console.log(`friend ship confirmed`);
            break;
        }
      } catch (e) {
        console.error(e);
      }
    });
  await bot.start();

  // after logged in...
  const room = await bot.Room.find({ topic: "沭阳微社区1群" }); // change `event-room` to any room topic in your wechat
  if (room) {
    room.on("join", async (room, inviteeList, inviter) => {
      const nameList = inviteeList.map((c) => c.name()).join(",");
      console.log(`Room got new member ${nameList}, invited by ${inviter}`);
      await room.say(
        `欢迎${nameList}加入👏👏， 你的邀请人是${inviter}`,
        ...inviteeList.push(inviter)
      );
    });
  }
}

main().catch(console.error);
