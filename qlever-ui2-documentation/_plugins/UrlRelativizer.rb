require 'pathname'

module Jekyll
    module UrlRelativizer
        def relativize_url(input)
            return if input.nil?
            input    = ensure_leading_slash(input)
            page_url = @context.registers[:page]["url"]
            page_dir = Pathname(page_url).parent

            target   = page_url.end_with?("/") ? Pathname(page_url) : page_dir
            Pathname(input).relative_path_from(target).to_s
        end
    end
end

Liquid::Template.register_filter(Jekyll::UrlRelativizer)
