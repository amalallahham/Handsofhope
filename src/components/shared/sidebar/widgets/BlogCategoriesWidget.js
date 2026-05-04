const BlogCategoriesWidget = ({ categories }) => {
  const details = [
    { title: "Event Date:", value: categories?.event_date },
    { title: "Doors Open:", value: categories?.doors_open },
    { title: "Venue:", value: categories?.venue },
    { title: "Address:", value: categories?.address },
  ];

  const ticketTypes = categories?.ticket_types ?? [];

  return (
    <div className="tj-sidebar-widget widget-categories">
      <h4 className="widget-title">Details</h4>
      <ul>
        {details.map(
          (item, idx) =>
            item?.value && (
              <li key={idx}>
                <p>
                  {item.title}{" "}
                  <span className="number">{item.value}</span>
                </p>
              </li>
            ),
        )}

        {ticketTypes.length > 0 && (
          // <li>
          //   <p>Tickets:</p>
          //   <ul style={{ paddingLeft: "0", marginTop: "4px" }}>
              ticketTypes.map((ticket) => (
                <li key={ticket.id}>
                  <p>
                    {ticket.name}:{" "}
                    <span className="number golden-color">
                      ${(ticket.price_cents / 100).toFixed(2)}
                    </span>
                  </p>
                </li>
              ))
          //   </ul>
          // </li>
        )}
      </ul>
    </div>
  );
};

export default BlogCategoriesWidget;