"use client";

export function HeroImage() {
  return (
    <div
      className="relative hidden lg:flex items-center justify-center min-h-[600px] animate-fade-in-right animation-delay-300 motion-reduce:animate-none"
    >
      {/* Main circular backdrop */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-[450px] h-[450px] xl:w-[550px] xl:h-[550px] rounded-full bg-gradient-to-br from-primary-100/60 via-amber-100/40 to-orange-100/30 dark:from-primary-500/20 dark:via-amber-500/10 dark:to-orange-500/5 animate-scale-in-center animation-delay-500 motion-reduce:animate-none"
        />
      </div>

      {/* Inner circle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-[350px] h-[350px] xl:w-[420px] xl:h-[420px] rounded-full bg-gradient-to-tr from-primary-200/50 via-amber-100/30 to-transparent dark:from-primary-600/20 dark:via-amber-500/10 dark:to-transparent animate-scale-in-center animation-delay-600 motion-reduce:animate-none"
        />
      </div>

      {/* Main Hero Image */}
      <div
        className="relative z-10 animate-fade-in-up animation-delay-400 motion-reduce:animate-none"
      >
        {/* Floating animation on the image */}
        <div className="animate-float motion-reduce:animate-none">
          <div className="relative w-[380px] h-[380px] xl:w-[480px] xl:h-[480px]">
            {/* Glow effect behind image */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-b from-primary/20 to-amber-500/10 blur-2xl dark:from-primary/15 dark:to-amber-500/5" />

            {/* Pizza Image - Using placeholder until real image is available */}
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Placeholder pizza visual */}
              <div className="w-[85%] h-[85%] rounded-full bg-gradient-to-br from-amber-200 via-orange-300 to-red-400 dark:from-amber-400 dark:via-orange-500 dark:to-red-600 shadow-2xl relative overflow-hidden">
                {/* Cheese texture */}
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-amber-100 via-yellow-200 to-amber-300 dark:from-amber-300 dark:via-yellow-400 dark:to-amber-500" />
                {/* Sauce */}
                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-red-400 via-red-500 to-red-600 dark:from-red-500 dark:via-red-600 dark:to-red-700" />
                {/* Center cheese */}
                <div className="absolute inset-12 rounded-full bg-gradient-to-br from-amber-200 via-yellow-300 to-orange-300 dark:from-amber-400 dark:via-yellow-500 dark:to-orange-500" />
                {/* Pepperoni spots */}
                <div className="absolute top-1/4 left-1/3 w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-800" />
                <div className="absolute top-1/2 right-1/4 w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-800" />
                <div className="absolute bottom-1/3 left-1/4 w-7 h-7 rounded-full bg-gradient-to-br from-red-600 to-red-800" />
                <div className="absolute bottom-1/4 right-1/3 w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-red-800" />
                {/* Basil leaves */}
                <div className="absolute top-1/3 right-1/3 w-6 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full rotate-45" />
                <div className="absolute bottom-1/2 left-1/2 w-5 h-2.5 bg-gradient-to-r from-green-500 to-green-600 rounded-full -rotate-12" />
              </div>
              {/* Shadow under pizza */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-8 bg-black/10 dark:bg-black/20 blur-xl rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements around the pizza */}
      <div
        className="absolute top-20 left-10 animate-pop-in animation-delay-1000 motion-reduce:animate-none"
      >
        <div className="animate-spin-slow motion-reduce:animate-none">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-400 to-red-500 shadow-lg flex items-center justify-center">
            <span className="text-2xl">🍅</span>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-32 left-8 animate-pop-in animation-delay-1100 motion-reduce:animate-none"
      >
        <div className="animate-spin-reverse motion-reduce:animate-none">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-500 shadow-lg flex items-center justify-center">
            <span className="text-xl">🌿</span>
          </div>
        </div>
      </div>

      <div
        className="absolute top-40 right-8 animate-pop-in animation-delay-1200 motion-reduce:animate-none"
      >
        <div className="animate-spin-slow animation-delay-1000 motion-reduce:animate-none">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 shadow-lg flex items-center justify-center">
            <span className="text-lg">🧀</span>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-24 right-16 animate-pop-in animation-delay-1300 motion-reduce:animate-none"
      >
        <div className="animate-spin-reverse animation-delay-500 motion-reduce:animate-none">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 shadow-lg flex items-center justify-center">
            <span className="text-xl">🌶️</span>
          </div>
        </div>
      </div>

      {/* Steam/heat waves effect */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 flex gap-2">
        <div className="w-1.5 h-8 bg-gradient-to-t from-transparent via-white/40 to-white/10 dark:via-white/20 dark:to-white/5 rounded-full blur-sm animate-steam motion-reduce:animate-none" />
        <div className="w-1.5 h-8 bg-gradient-to-t from-transparent via-white/40 to-white/10 dark:via-white/20 dark:to-white/5 rounded-full blur-sm animate-steam animation-delay-300 motion-reduce:animate-none" />
        <div className="w-1.5 h-8 bg-gradient-to-t from-transparent via-white/40 to-white/10 dark:via-white/20 dark:to-white/5 rounded-full blur-sm animate-steam animation-delay-600 motion-reduce:animate-none" />
      </div>
    </div>
  );
}
