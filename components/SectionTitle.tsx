import React from "react";

const SectionTitle = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="text-center space-y-4 my-12">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
        {description}
      </p>
    </div>
  );
};

export default SectionTitle;
