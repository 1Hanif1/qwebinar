import { BorderTrail } from "@/components/ui/border-trail";

function Header({ user }) {
  const { full_name: name, num_rooms, premium } = user;
  return (
    <header className="border-b border-gray-200 bg-gray-50 w-full">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Welcome, {name.split(" ").at(0)}!
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <p>{num_rooms} / 2 Rooms</p>
            {!premium ? (
              <button
                className="relative inline-flex items-center justify-center gap-1.5 rounded-sm border border-gray-200 bg-white px-5 py-3 text-gray-900 transition hover:text-gray-700 focus:ring-3 focus:outline-hidden animate-pulse"
                type="button"
              >
                <BorderTrail
                  style={{
                    boxShadow:
                      "0px 0px 60px 30px hsl(47.9 95.8% 53.1%), 0 0 100px 60px hsl(47.9 95.8% 53.1%), 0 0 140px 90px hsl(47.9 95.8% 53.1%)",
                  }}
                  size={0}
                />
                <span className="text-sm font-medium"> Get Premium </span>
              </button>
            ) : null}

            <button
              className="inline-block rounded-sm bg-primary px-5 py-3 text-sm font-medium text-black transition hover:bg-primary/80 hover:border-primary border focus:ring-3 focus:outline-hidden"
              type="button"
            >
              Create Room
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
